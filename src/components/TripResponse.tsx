
import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import ChatInterface from "./ChatInterface";

interface TripResponseProps {
  response: string;
}

const TripResponse = ({ response }: TripResponseProps) => {
  // Function to extract and parse flight data from markdown
  const extractFlightData = (text: string) => {
    try {
      const flightDataMatch = text.match(/Available Flight Information:\s*({[\s\S]*?})\s*Please/);
      if (flightDataMatch && flightDataMatch[1]) {
        return JSON.parse(flightDataMatch[1]);
      }
      return null;
    } catch (error) {
      console.error('Error parsing flight data:', error);
      return null;
    }
  };

  const flightData = extractFlightData(response);

  const renderFlightTable = (flights: any[]) => {
    return (
      <div className="my-6 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Airline</TableHead>
              <TableHead>Flight</TableHead>
              <TableHead>Departure</TableHead>
              <TableHead>Arrival</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flights.map((flight, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <img 
                      src={flight.airline_logo} 
                      alt={flight.flights[0].airline}
                      className="w-6 h-6 object-contain"
                    />
                    <span>{flight.flights[0].airline}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {flight.flights.map((f: any, i: number) => (
                    <div key={i} className="mb-1">
                      {f.flight_number}
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  {flight.flights.map((f: any, i: number) => (
                    <div key={i} className="mb-1">
                      <div className="font-medium">{f.departure_airport.id}</div>
                      <div className="text-sm text-gray-500">{f.departure_airport.time}</div>
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  {flight.flights.map((f: any, i: number) => (
                    <div key={i} className="mb-1">
                      <div className="font-medium">{f.arrival_airport.id}</div>
                      <div className="text-sm text-gray-500">{f.arrival_airport.time}</div>
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  <div>{Math.floor(flight.total_duration / 60)}h {flight.total_duration % 60}m</div>
                  {flight.layovers && flight.layovers.length > 0 && (
                    <div className="text-sm text-gray-500">
                      {flight.layovers.length} layover(s)
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="font-medium">${flight.price}</div>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      // In a real application, this would redirect to the booking page
                      console.log('Booking token:', flight.booking_token);
                      alert('In a real application, this would redirect to the booking page');
                    }}
                  >
                    Book Now
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="w-full animate-fadeIn">
      <Card className="w-full max-w-2xl p-6 mx-auto mt-8 bg-white/80 backdrop-blur-lg shadow-lg rounded-xl">
        <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none dark:prose-invert">
          {flightData && renderFlightTable(flightData)}
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
      
      <ChatInterface initialContext={response} />
    </div>
  );
};

export default TripResponse;
