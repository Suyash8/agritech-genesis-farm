import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Droplets, ThermometerSun, Leaf, DollarSign, Activity, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FarmerInputData } from "@/types";
import { v4 as uuidv4 } from "uuid";

const CROPS = ["Wheat", "Soybean", "Corn", "Rice"];
const FINANCIAL_GOALS = ["Maximum Profit", "Balanced", "Low Investment"];
const SUSTAINABILITY_LEVELS = ["Low", "Medium", "High"];

const FarmerInput = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<FarmerInputData>({
    soilPh: 6.5,
    soilMoisture: 50,
    temperature: 25,
    rainfall: 120,
    preferredCrops: [],
    financialGoal: "Balanced",
    sustainabilityGoal: "Medium",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value),
    }));
  };

  const handleCropToggle = (crop: string) => {
    setFormData(prev => {
      if (prev.preferredCrops.includes(crop)) {
        return {
          ...prev,
          preferredCrops: prev.preferredCrops.filter(c => c !== crop),
        };
      } else {
        return {
          ...prev,
          preferredCrops: [...prev.preferredCrops, crop],
        };
      }
    });
  };

  const handleGoalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate a session ID
    const sessionId = uuidv4();
    
    // Store the form data in localStorage
    const newFormData = {
      ...formData,
      timestamp: Date.now(),
    };
    
    localStorage.setItem(`farmInput_${sessionId}`, JSON.stringify(newFormData));
    localStorage.setItem('currentSessionId', sessionId);
    
    toast({
      title: "Form submitted successfully",
      description: "Redirecting to the agent output page...",
    });
    
    // Navigate to the agent output page
    navigate(`/agent-output?session=${sessionId}`);
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8 text-gradient">New Advisory Session</h1>
      
      <div className="glass-card rounded-xl p-6 mb-8">
        <h2 className="text-xl font-medium mb-4">Farm Input Data</h2>
        <p className="text-muted-foreground mb-6">
          Please provide information about your farm's environmental conditions and preferences. 
          This will help our AI agents generate tailored recommendations.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Leaf className="h-5 w-5 text-farm-green" />
              <span>Soil Conditions</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label htmlFor="soilPh" className="text-sm">
                    Soil pH
                  </label>
                  <span className="text-sm text-tech-blue">{formData.soilPh}</span>
                </div>
                <input
                  type="range"
                  id="soilPh"
                  name="soilPh"
                  min="4"
                  max="9"
                  step="0.1"
                  value={formData.soilPh}
                  onChange={handleSliderChange}
                  className="farmer-input-field"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Acidic (4.0)</span>
                  <span>Neutral (7.0)</span>
                  <span>Alkaline (9.0)</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label htmlFor="soilMoisture" className="text-sm flex items-center gap-1">
                    <Droplets className="h-4 w-4 text-tech-blue" />
                    Soil Moisture (%)
                  </label>
                  <span className="text-sm text-tech-blue">{formData.soilMoisture}%</span>
                </div>
                <input
                  type="range"
                  id="soilMoisture"
                  name="soilMoisture"
                  min="0"
                  max="100"
                  value={formData.soilMoisture}
                  onChange={handleSliderChange}
                  className="farmer-input-field"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Dry (0%)</span>
                  <span>Optimal (50%)</span>
                  <span>Saturated (100%)</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <ThermometerSun className="h-5 w-5 text-yellow-500" />
              <span>Climate Conditions</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label htmlFor="temperature" className="text-sm">
                    Average Temperature (°C)
                  </label>
                  <span className="text-sm text-tech-blue">{formData.temperature}°C</span>
                </div>
                <input
                  type="range"
                  id="temperature"
                  name="temperature"
                  min="5"
                  max="40"
                  value={formData.temperature}
                  onChange={handleSliderChange}
                  className="farmer-input-field"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Cool (5°C)</span>
                  <span>Moderate (25°C)</span>
                  <span>Hot (40°C)</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label htmlFor="rainfall" className="text-sm">
                    Monthly Rainfall (mm)
                  </label>
                  <span className="text-sm text-tech-blue">{formData.rainfall} mm</span>
                </div>
                <input
                  type="range"
                  id="rainfall"
                  name="rainfall"
                  min="0"
                  max="300"
                  value={formData.rainfall}
                  onChange={handleSliderChange}
                  className="farmer-input-field"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Dry (0mm)</span>
                  <span>Moderate (150mm)</span>
                  <span>Wet (300mm)</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Leaf className="h-5 w-5 text-farm-green" />
              <span>Crop Preferences</span>
            </h3>
            
            <div className="space-y-4">
              <label className="text-sm">Select Preferred Crops (Optional)</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {CROPS.map(crop => (
                  <button
                    key={crop}
                    type="button"
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      formData.preferredCrops.includes(crop)
                        ? "bg-farm-green/20 border-farm-green text-farm-green"
                        : "border-muted bg-transparent text-muted-foreground hover:bg-secondary"
                    }`}
                    onClick={() => handleCropToggle(crop)}
                  >
                    {crop}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {formData.preferredCrops.length === 0 
                  ? "No preference selected. System will recommend based on all available crops."
                  : `Selected ${formData.preferredCrops.length} crop(s): ${formData.preferredCrops.join(", ")}`}
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Activity className="h-5 w-5 text-tech-purple" />
              <span>Goals and Priorities</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="financialGoal" className="text-sm flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-tech-blue" />
                  Financial Goal
                </label>
                <select
                  id="financialGoal"
                  name="financialGoal"
                  value={formData.financialGoal}
                  onChange={handleGoalChange}
                  className="farmer-input-field bg-secondary"
                >
                  {FINANCIAL_GOALS.map(goal => (
                    <option key={goal} value={goal}>{goal}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="sustainabilityGoal" className="text-sm flex items-center gap-1">
                  <Leaf className="h-4 w-4 text-farm-green" />
                  Sustainability Target
                </label>
                <select
                  id="sustainabilityGoal"
                  name="sustainabilityGoal"
                  value={formData.sustainabilityGoal}
                  onChange={handleGoalChange}
                  className="farmer-input-field bg-secondary"
                >
                  {SUSTAINABILITY_LEVELS.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="bg-gradient-to-r from-farm-green to-tech-blue text-white font-medium py-3 px-6 rounded-full flex items-center gap-2 hover:shadow-lg hover:shadow-farm-green/20 transition-all duration-300"
            >
              Start Advisory Process <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FarmerInput;
