
import { Card } from "@/components/ui/card";

interface TripResponseProps {
  response: string;
}

const TripResponse = ({ response }: TripResponseProps) => {
  return (
    <Card className="w-full max-w-2xl p-6 mt-8 bg-white/80 backdrop-blur-lg shadow-lg rounded-xl animate-fadeIn">
      <div className="prose prose-sm max-w-none">
        <div className="whitespace-pre-wrap">{response}</div>
      </div>
    </Card>
  );
};

export default TripResponse;
