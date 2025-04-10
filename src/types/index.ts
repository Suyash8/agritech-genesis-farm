
export interface FarmerInputData {
  soilPh: number;
  soilMoisture: number;
  temperature: number;
  rainfall: number;
  preferredCrops: string[];
  financialGoal: string;
  sustainabilityGoal: string;
  timestamp?: number;
}

export interface AgentOutput {
  agent_type: "farmer_advisor" | "market_researcher" | "weather_analyst" | "agri_expert";
  output: any;
}

export interface FarmerAdvisorOutput extends AgentOutput {
  agent_type: "farmer_advisor";
  output: {
    suggested_crop: string;
    fertilizer_usage_kg: number;
    pesticide_usage_kg: number;
    sustainability_score: number;
    recommendations: string[];
  };
}

export interface MarketResearcherOutput extends AgentOutput {
  agent_type: "market_researcher";
  output: {
    crop_profitability: Record<string, number>;
    demand_supply_trends: Record<string, string>;
    best_crop: string;
  };
}

export interface WeatherAnalystOutput extends AgentOutput {
  agent_type: "weather_analyst";
  output: {
    weather_forecast: string;
    best_suited_crops: string[];
    weather_impact_score: number;
    recommendations: string[];
  };
}

export interface AgriExpertOutput extends AgentOutput {
  agent_type: "agri_expert";
  output: {
    final_crop_recommendation: string;
    reasoning: string[];
    sustainability_score: number;
  };
}

export interface AdvisorySession {
  id: string;
  input: FarmerInputData;
  outputs: AgentOutput[];
  timestamp: number;
}

export interface VectorInsight {
  id: string;
  similarity_score: number;
  farm_name: string;
  main_crop: string;
  region: string;
  note: string;
}
