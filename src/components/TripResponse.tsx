
import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

interface TripResponseProps {
  response: string;
}

const TripResponse = ({ response }: TripResponseProps) => {
  return (
    <Card className="w-full max-w-2xl p-6 mt-8 bg-white/80 backdrop-blur-lg shadow-lg rounded-xl animate-fadeIn">
      <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none dark:prose-invert">
        <ReactMarkdown
          components={{
            h1: ({ children }) => <h1 className="text-2xl md:text-3xl font-bold text-travel-600 mb-4">{children}</h1>,
            h2: ({ children }) => <h2 className="text-xl md:text-2xl font-semibold text-travel-500 mt-6 mb-3">{children}</h2>,
            h3: ({ children }) => <h3 className="text-lg md:text-xl font-medium text-travel-400 mt-4 mb-2">{children}</h3>,
            p: ({ children }) => <p className="text-gray-600 dark:text-gray-300 mb-4">{children}</p>,
            ul: ({ children }) => <ul className="list-disc list-inside space-y-2 mb-4">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal list-inside space-y-2 mb-4">{children}</ol>,
            li: ({ children }) => <li className="text-gray-600 dark:text-gray-300">{children}</li>,
            strong: ({ children }) => <strong className="font-semibold text-travel-500">{children}</strong>,
            em: ({ children }) => <em className="text-travel-400 italic">{children}</em>,
          }}
        >
          {response}
        </ReactMarkdown>
      </div>
    </Card>
  );
};

export default TripResponse;

