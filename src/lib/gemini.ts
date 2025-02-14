
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/integrations/supabase/client";

async function getFlightInfo(source: string, destination: string, date: Date) {
  try {
    const { data: config } = await supabase
      .from('secrets')
      .select('value')
      .eq('name', 'SERPAPI_API_KEY')
      .maybeSingle();

    if (!config?.value) {
      console.log('SerpAPI key not found');
      return null;
    }

    const formattedDate = date.toISOString().split('T')[0];
    const searchUrl = `https://serpapi.com/search.json?engine=google_flights&departure_id=${source}&arrival_id=${destination}&outbound_date=${formattedDate}&api_key=${config.value}`;
    
    const response = await fetch(searchUrl);
    const data = await response.json();
    return data.flights_results;
  } catch (error) {
    console.error('Error fetching flight information:', error);
    return null;
  }
}

export const generateTravelPlan = async (formData: {
  source: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  budget: string;
  travelers: string;
  interests: string;
  includeFlights: boolean;
}) => {
  // Fetch the API key from Supabase
  const { data: config, error } = await supabase
    .from('secrets')
    .select('value')
    .eq('name', 'GEMINI_API_KEY')
    .maybeSingle();

  console.log('Supabase query result:', { config, error }); // Debug log

  if (error) {
    console.error('Error fetching Gemini API key:', error);
    throw new Error(`Failed to fetch Gemini API key: ${error.message}`);
  }

  if (!config?.value) {
    throw new Error("Gemini API key not found in database. Please make sure you've added it in the project settings.");
  }

  let flightInfo = null;
  if (formData.includeFlights) {
    flightInfo = await getFlightInfo(formData.source, formData.destination, formData.startDate);
  }

  const genAI = new GoogleGenerativeAI(config.value);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const flightInfoPrompt = flightInfo ? `
    Available Flight Information:
    ${JSON.stringify(flightInfo, null, 2)}
    Please include these flight options in the transportation recommendations.
  ` : '';

  const prompt = `Act as a travel planning expert and create a detailed travel itinerary based on the following information:

Source: ${formData.source}
Destination: ${formData.destination}
Dates: ${formData.startDate.toLocaleDateString()} to ${formData.endDate.toLocaleDateString()}
Budget: ${formData.budget}
Number of Travelers: ${formData.travelers}
Interests: ${formData.interests}
${flightInfoPrompt}

Please provide a comprehensive travel plan including:
1. Transportation recommendations${formData.includeFlights ? ' with specific flight options' : ''}
2. Accommodation suggestions within budget
3. Daily activities and sightseeing recommendations based on interests
4. Local food and restaurant recommendations
5. Estimated costs for major expenses
6. Travel tips and cultural considerations

Please format the response in a clear, organized manner using markdown headings and bullet points.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error: any) {
    console.error("Error generating travel plan:", error);
    if (error.message?.includes("API key not valid")) {
      throw new Error("Invalid Gemini API key. Please check your API key configuration.");
    }
    throw new Error(`Failed to generate travel plan: ${error.message}`);
  }
};
