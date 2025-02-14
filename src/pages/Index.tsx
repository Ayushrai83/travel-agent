
import { useState } from "react";
import TravelForm, { TravelFormData } from "@/components/TravelForm";
import TripResponse from "@/components/TripResponse";
import LoadingSpinner from "@/components/LoadingSpinner";
import { generateTravelPlan } from "@/lib/gemini";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (formData: TravelFormData) => {
    setLoading(true);
    try {
      const result = await generateTravelPlan(formData);
      setResponse(result);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate travel plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-travel-50 to-travel-100">
      <div className="container px-4 py-16 mx-auto">
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl font-bold text-travel-600 mb-4">AI Travel Planner</h1>
          <p className="text-travel-500 max-w-2xl mx-auto">
            Let our AI create a personalized travel itinerary based on your preferences
          </p>
        </div>

        <div className="flex flex-col items-center space-y-8">
          <TravelForm onSubmit={handleSubmit} isLoading={loading} />
          
          {loading && <LoadingSpinner />}
          
          {response && <TripResponse response={response} />}
        </div>
      </div>
    </div>
  );
};

export default Index;
