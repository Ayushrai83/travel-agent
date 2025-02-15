import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/integrations/supabase/client";

const mockFlightData = {
  "best_flights": [
    {
      "flights": [
        {
          "departure_airport": {
            "name": "Indira Gandhi International Airport",
            "id": "DEL",
            "time": "2025-02-15 15:00"
          },
          "arrival_airport": {
            "name": "Netaji Subhash Chandra Bose International Airport",
            "id": "CCU",
            "time": "2025-02-15 17:10"
          },
          "duration": 130,
          "airplane": "Airbus A321neo",
          "airline": "IndiGo",
          "airline_logo": "https://www.gstatic.com/flights/airline_logos/70px/6E.png",
          "travel_class": "Economy",
          "flight_number": "6E 543",
          "legroom": "29 in",
          "extensions": [
            "Below average legroom (29 in)",
            "Carbon emissions estimate: 92 kg"
          ]
        },
        {
          "departure_airport": {
            "name": "Netaji Subhash Chandra Bose International Airport",
            "id": "CCU",
            "time": "2025-02-15 22:05"
          },
          "arrival_airport": {
            "name": "Noi Bai International Airport",
            "id": "HAN",
            "time": "2025-02-16 02:10"
          },
          "duration": 155,
          "airplane": "Airbus A321neo",
          "airline": "IndiGo",
          "airline_logo": "https://www.gstatic.com/flights/airline_logos/70px/6E.png",
          "travel_class": "Economy",
          "flight_number": "6E 1631",
          "legroom": "29 in",
          "extensions": [
            "Below average legroom (29 in)",
            "Carbon emissions estimate: 117 kg"
          ],
          "overnight": true
        }
      ],
      "layovers": [
        {
          "duration": 295,
          "name": "Netaji Subhash Chandra Bose International Airport",
          "id": "CCU"
        }
      ],
      "total_duration": 580,
      "carbon_emissions": {
        "this_flight": 210000,
        "typical_for_this_route": 223000,
        "difference_percent": -6
      },
      "price": 335,
      "type": "One way",
      "airline_logo": "https://www.gstatic.com/flights/airline_logos/70px/6E.png",
      "booking_token": "WyJDalJJT0RKd1pIWmljSGc0VHpCQlFrZDRTVUZDUnkwdExTMHRMUzB0TFhaMFluSXlOa0ZCUVVGQlIyVjJRVmxOUW5reFNIZEJFZ3cyUlRVME0zdzJSVEUyTXpFYUN3aXJoUUlRQWhvRFZWTkVPQnh3cTRVQyIsW1siREVMIiwiMjAyNS0wMi0xNSIsIkNDVSIsbnVsbCwiNkUiLCI1NDMiXSxbIkNDVSIsIjIwMjUtMDItMTUiLCJIQU4iLG51bGwsIjZFIiwiMTYzMSJdXV0="
    }
  ]
};

async function getFlightInfo(source: string, destination: string, date: Date) {
  try {
    const { data: config } = await supabase
      .from('secrets')
      .select('value')
      .eq('name', 'SERPAPI_API_KEY')
      .maybeSingle();

    if (!config?.value) {
      console.error('SerpAPI key not found');
      throw new Error('SerpAPI key not found in database');
    }

    const formattedDate = date.toISOString().split('T')[0];
    const searchUrl = `https://serpapi.com/search.json?engine=google_flights&departure_id=${source}&arrival_id=${destination}&outbound_date=${formattedDate}&api_key=${config.value}`;
    
    const response = await fetch(searchUrl);
    if (!response.ok) {
      throw new Error(`SerpAPI request failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(`SerpAPI error: ${data.error}`);
    }
    
    return data.flights_results;
  } catch (error) {
    console.error('Error fetching flight information:', error);
    throw error;
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
    Please include these flight options in the transportation recommendations, including details about:
    - Flight numbers and airlines
    - Departure and arrival times
    - Layover information
    - Price and duration
    - Any additional features (legroom, carbon emissions)
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
