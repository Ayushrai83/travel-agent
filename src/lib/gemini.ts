
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/integrations/supabase/client";

export const generateTravelPlan = async (formData: {
  source: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  budget: string;
  travelers: string;
  interests: string;
}) => {
  // Fetch the API key from Supabase
  const { data: config, error } = await supabase
    .from('secrets')
    .select('value')
    .eq('name', 'GEMINI_API_KEY')
    .single();

  if (error || !config?.value) {
    throw new Error("Gemini API key is not configured. Please check your settings.");
  }

  const genAI = new GoogleGenerativeAI(config.value);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Act as a travel planning expert and create a detailed travel itinerary based on the following information:

Source: ${formData.source}
Destination: ${formData.destination}
Dates: ${formData.startDate.toLocaleDateString()} to ${formData.endDate.toLocaleDateString()}
Budget: ${formData.budget}
Number of Travelers: ${formData.travelers}
Interests: ${formData.interests}

Please provide a comprehensive travel plan including:
1. Transportation recommendations
2. Accommodation suggestions within budget
3. Daily activities and sightseeing recommendations based on interests
4. Local food and restaurant recommendations
5. Estimated costs for major expenses
6. Travel tips and cultural considerations

Please format the response in a clear, organized manner.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error: any) {
    console.error("Error generating travel plan:", error);
    if (error.message?.includes("API key not valid")) {
      throw new Error("Invalid API key. Please check your Gemini API key configuration.");
    }
    throw new Error("Failed to generate travel plan. Please try again.");
  }
};
