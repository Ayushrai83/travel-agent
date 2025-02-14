
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";

interface TravelFormProps {
  onSubmit: (formData: TravelFormData) => void;
  isLoading: boolean;
}

export interface TravelFormData {
  source: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  budget: string;
  travelers: string;
  interests: string;
  includeFlights: boolean;
}

const TravelForm = ({ onSubmit, isLoading }: TravelFormProps) => {
  const [formData, setFormData] = useState<TravelFormData>({
    source: "",
    destination: "",
    startDate: new Date(),
    endDate: new Date(),
    budget: "",
    travelers: "",
    interests: "",
    includeFlights: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Card className="w-full max-w-2xl p-6 bg-white/80 backdrop-blur-lg shadow-lg rounded-xl animate-fadeIn">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="source">Source</Label>
            <Input
              id="source"
              name="source"
              value={formData.source}
              onChange={handleChange}
              placeholder="Enter departure city"
              className="bg-white/50"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="Enter destination city"
              className="bg-white/50"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <DatePicker
              date={formData.startDate}
              setDate={(date) => setFormData((prev) => ({ ...prev, startDate: date }))}
            />
          </div>
          <div className="space-y-2">
            <Label>End Date</Label>
            <DatePicker
              date={formData.endDate}
              setDate={(date) => setFormData((prev) => ({ ...prev, endDate: date }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="budget">Budget</Label>
            <Input
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="Enter your budget"
              className="bg-white/50"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="travelers">Number of Travelers</Label>
            <Input
              id="travelers"
              name="travelers"
              value={formData.travelers}
              onChange={handleChange}
              placeholder="Enter number of travelers"
              className="bg-white/50"
              type="number"
              min="1"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="interests">Interests</Label>
          <Input
            id="interests"
            name="interests"
            value={formData.interests}
            onChange={handleChange}
            placeholder="Enter your interests (e.g., culture, food, adventure)"
            className="bg-white/50"
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="includeFlights"
            checked={formData.includeFlights}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, includeFlights: checked as boolean }))
            }
          />
          <Label htmlFor="includeFlights" className="text-sm text-gray-600">
            Include flight information in travel plan
          </Label>
        </div>

        <Button
          type="submit"
          className="w-full bg-travel-600 hover:bg-travel-500 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? "Planning Your Trip..." : "Plan My Trip"}
        </Button>
      </form>
    </Card>
  );
};

export default TravelForm;
