
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  initialContext: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ initialContext }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const { data: config } = await supabase
        .from('secrets')
        .select('value')
        .eq('name', 'GEMINI_API_KEY')
        .maybeSingle();

      if (!config?.value) {
        throw new Error('Gemini API key not found');
      }

      const genAI = new GoogleGenerativeAI(config.value);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Previous travel plan context:
${initialContext}

User question: ${userMessage}

Please provide a helpful response about the travel plan, taking into account the previous context. If the question is about something not mentioned in the travel plan, feel free to provide general travel advice.`;

      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 p-4 bg-white/80 backdrop-blur-lg rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold text-travel-600 mb-4">Ask Questions About Your Trip</h2>
      
      <ScrollArea className="h-[400px] w-full mb-4 rounded-lg border p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.role === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block max-w-[80%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-travel-500 text-white ml-auto'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <ReactMarkdown className="prose prose-sm max-w-none">
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-center text-gray-500">
            Thinking...
          </div>
        )}
      </ScrollArea>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your trip..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading || !input.trim()}>
          Send
        </Button>
      </form>
    </div>
  );
};

export default ChatInterface;
