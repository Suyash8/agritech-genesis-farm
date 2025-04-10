
import type { 
  AgentOutput, 
  FarmerAdvisorOutput,
  MarketResearcherOutput,
  WeatherAnalystOutput,
  AgriExpertOutput,
  VectorInsight,
  FarmerInputData,
  AdvisorySession
} from "../types";

export const generateFarmerAdvisorOutput = (input: FarmerInputData): FarmerAdvisorOutput => {
  const crops = input.preferredCrops.length > 0 
    ? input.preferredCrops 
    : ["Wheat", "Soybean", "Corn", "Rice"];
  
  const randomCrop = crops[Math.floor(Math.random() * crops.length)];
  
  return {
    agent_type: "farmer_advisor",
    output: {
      suggested_crop: randomCrop,
      fertilizer_usage_kg: parseFloat((80 + Math.random() * 50).toFixed(1)),
      pesticide_usage_kg: parseFloat((2 + Math.random() * 3).toFixed(1)),
      sustainability_score: Math.floor(60 + Math.random() * 30),
      recommendations: [
        "Increase soil moisture retention with mulch.",
        "Use organic fertilizers to minimize environmental impact.",
        "Consider drip irrigation to conserve water.",
        `${randomCrop} grows well in your soil pH conditions.`,
        "Rotate crops annually to improve soil health."
      ]
    }
  };
};

export const generateMarketResearcherOutput = (
  suggestedCrop: string, 
  crops: string[]
): MarketResearcherOutput => {
  const profitability: Record<string, number> = {};
  const trends: Record<string, string> = {};
  
  // Ensure suggested crop has highest profitability
  const baseProfitability = 800;
  
  crops.forEach(crop => {
    if (crop === suggestedCrop) {
      profitability[crop] = baseProfitability + 200 + Math.floor(Math.random() * 200);
      trends[crop] = "High demand, low supply";
    } else {
      profitability[crop] = baseProfitability - 100 + Math.floor(Math.random() * 300);
      
      const trendOptions = [
        "Moderate demand, stable supply",
        "Low demand, oversupply",
        "Growing demand, increasing supply",
        "Decreasing demand, high supply"
      ];
      
      trends[crop] = trendOptions[Math.floor(Math.random() * trendOptions.length)];
    }
  });
  
  return {
    agent_type: "market_researcher",
    output: {
      crop_profitability: profitability,
      demand_supply_trends: trends,
      best_crop: suggestedCrop
    }
  };
};

export const generateWeatherAnalystOutput = (
  suggestedCrop: string,
  crops: string[]
): WeatherAnalystOutput => {
  const weatherOptions = ["mild_rain", "sunny", "cloudy", "humid", "dry", "stormy"];
  const randomWeather = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
  
  // Ensure suggested crop is in the suited crops list
  const suitedCrops = [suggestedCrop];
  
  // Randomly add 1-2 more crops
  const otherCrops = crops.filter(c => c !== suggestedCrop);
  const additionalCropsCount = Math.floor(Math.random() * 2) + 1;
  
  for (let i = 0; i < additionalCropsCount && i < otherCrops.length; i++) {
    const randomIndex = Math.floor(Math.random() * otherCrops.length);
    suitedCrops.push(otherCrops[randomIndex]);
    otherCrops.splice(randomIndex, 1);
  }
  
  const recommendations = [
    `${suggestedCrop} is optimal for the upcoming weather conditions.`
  ];
  
  if (otherCrops.length > 0) {
    recommendations.push(`Avoid planting ${otherCrops[0]} due to potential climate risks.`);
  }
  
  recommendations.push(
    "Consider adjusting irrigation based on forecasted precipitation.",
    "Install weather sensors for real-time monitoring of field conditions."
  );
  
  return {
    agent_type: "weather_analyst",
    output: {
      weather_forecast: randomWeather,
      best_suited_crops: suitedCrops,
      weather_impact_score: 55 + Math.floor(Math.random() * 30),
      recommendations
    }
  };
};

export const generateAgriExpertOutput = (
  suggestedCrop: string,
  marketOutput: MarketResearcherOutput,
  weatherOutput: WeatherAnalystOutput
): AgriExpertOutput => {
  // Generate reasoning based on previous outputs
  const reasoning = [
    `${suggestedCrop} has the highest profitability in the current market at $${marketOutput.output.crop_profitability[suggestedCrop]}/acre.`,
    `${suggestedCrop} is well-suited for the ${weatherOutput.output.weather_forecast.replace('_', ' ')} weather forecast.`,
    "The optimal planting density will maximize yield while conserving resources.",
    "Modern precision agriculture techniques will reduce environmental impact.",
    `${suggestedCrop} has the lowest water requirements among available options.`
  ];
  
  return {
    agent_type: "agri_expert",
    output: {
      final_crop_recommendation: suggestedCrop,
      reasoning,
      sustainability_score: 70 + Math.floor(Math.random() * 20)
    }
  };
};

export const generateMockVectorInsights = (): VectorInsight[] => {
  const regions = ["Midwest", "Pacific Northwest", "California Central Valley", "Great Plains", "Southern Delta"];
  const cropTypes = ["Wheat", "Soybean", "Corn", "Rice"];
  const farmNames = ["Sunshine Acres", "Green Valley", "Heartland Fields", "Golden Harvest", "Blue River Farms"];
  
  return Array.from({ length: 5 }, (_, i) => ({
    id: `vec-${i + 1}`,
    similarity_score: 0.7 + (Math.random() * 0.25),
    farm_name: farmNames[i],
    main_crop: cropTypes[Math.floor(Math.random() * cropTypes.length)],
    region: regions[Math.floor(Math.random() * regions.length)],
    note: `Similar soil conditions and climate patterns to your farm.`
  })).sort((a, b) => b.similarity_score - a.similarity_score);
};

export const simulateAgentProcess = async (
  input: FarmerInputData, 
  agentType: "farmer_advisor" | "market_researcher" | "weather_analyst" | "agri_expert",
  previousOutputs: AgentOutput[] = []
): Promise<AgentOutput> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  
  const allCrops = ["Wheat", "Soybean", "Corn", "Rice"];
  const preferredCrops = input.preferredCrops.length > 0 ? input.preferredCrops : allCrops;
  
  // Get previous outputs for context if they exist
  const farmerOutput = previousOutputs.find(o => o.agent_type === "farmer_advisor") as FarmerAdvisorOutput | undefined;
  const marketOutput = previousOutputs.find(o => o.agent_type === "market_researcher") as MarketResearcherOutput | undefined;
  const weatherOutput = previousOutputs.find(o => o.agent_type === "weather_analyst") as WeatherAnalystOutput | undefined;
  
  // Default suggested crop
  let suggestedCrop = farmerOutput?.output.suggested_crop || preferredCrops[0];
  
  switch (agentType) {
    case "farmer_advisor":
      return generateFarmerAdvisorOutput(input);
      
    case "market_researcher":
      if (!farmerOutput) throw new Error("Farmer advisor output required");
      return generateMarketResearcherOutput(farmerOutput.output.suggested_crop, preferredCrops);
      
    case "weather_analyst":
      if (!farmerOutput) throw new Error("Farmer advisor output required");
      return generateWeatherAnalystOutput(farmerOutput.output.suggested_crop, preferredCrops);
      
    case "agri_expert":
      if (!marketOutput || !weatherOutput) 
        throw new Error("Market and weather outputs required");
      return generateAgriExpertOutput(
        suggestedCrop,
        marketOutput,
        weatherOutput
      );
      
    default:
      throw new Error(`Unknown agent type: ${agentType}`);
  }
};

export const saveAdvisorySession = (session: AdvisorySession): void => {
  try {
    // Get existing sessions
    const existingSessions = JSON.parse(localStorage.getItem('advisorySessions') || '[]');
    
    // Add new session
    existingSessions.push(session);
    
    // Save back to localStorage
    localStorage.setItem('advisorySessions', JSON.stringify(existingSessions));
  } catch (e) {
    console.error("Failed to save advisory session", e);
  }
};

export const getAdvisorySessions = (): AdvisorySession[] => {
  try {
    return JSON.parse(localStorage.getItem('advisorySessions') || '[]');
  } catch (e) {
    console.error("Failed to retrieve advisory sessions", e);
    return [];
  }
};
