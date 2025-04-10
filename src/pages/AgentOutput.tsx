
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Farm, LineChart, Cloud, Sprout, Check, AlertTriangle, ArrowUpRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import AgentStepper from "@/components/AgentStepper";
import { 
  simulateAgentProcess, 
  saveAdvisorySession,
  generateMockVectorInsights
} from "@/utils/mockData";
import type { 
  FarmerInputData, 
  AgentOutput, 
  FarmerAdvisorOutput,
  MarketResearcherOutput,
  WeatherAnalystOutput,
  AgriExpertOutput
} from "@/types";

const AgentOutputPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [farmInputData, setFarmInputData] = useState<FarmerInputData | null>(null);
  const [currentAgentIndex, setCurrentAgentIndex] = useState<number>(0);
  const [agentOutputs, setAgentOutputs] = useState<AgentOutput[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [progress, setProgress] = useState<number>(0);
  
  const agentTypes = ["farmer_advisor", "market_researcher", "weather_analyst", "agri_expert"];
  
  useEffect(() => {
    // Get session id from query params or localStorage
    const params = new URLSearchParams(location.search);
    const paramSessionId = params.get("session");
    const storedSessionId = localStorage.getItem("currentSessionId");
    
    const effectiveSessionId = paramSessionId || storedSessionId;
    setSessionId(effectiveSessionId);
    
    if (effectiveSessionId) {
      // Try to load farm input data
      const storedFarmData = localStorage.getItem(`farmInput_${effectiveSessionId}`);
      
      if (storedFarmData) {
        setFarmInputData(JSON.parse(storedFarmData));
      } else {
        // No farm data found, redirect to input form
        toast({
          title: "No farm data found",
          description: "Please fill out the farm input form first",
          variant: "destructive"
        });
        navigate("/farmer-input");
      }
    } else {
      // No session id found, redirect to input form
      toast({
        title: "No active session",
        description: "Please start a new advisory session",
        variant: "destructive"
      });
      navigate("/farmer-input");
    }
  }, [location.search, navigate, toast]);
  
  useEffect(() => {
    if (farmInputData && !isProcessing && currentAgentIndex < agentTypes.length) {
      runNextAgent();
    }
  }, [farmInputData, currentAgentIndex, agentOutputs]);
  
  const runNextAgent = async () => {
    if (!farmInputData || currentAgentIndex >= agentTypes.length) return;
    
    setIsProcessing(true);
    const agentType = agentTypes[currentAgentIndex] as any;
    
    try {
      // Update progress for UI feedback
      setProgress((currentAgentIndex / agentTypes.length) * 100);
      
      // Simulate API call to agent
      const result = await simulateAgentProcess(farmInputData, agentType, agentOutputs);
      
      // Add result to outputs
      setAgentOutputs(prev => [...prev, result]);
      
      // Move to next agent
      setCurrentAgentIndex(prevIndex => prevIndex + 1);
      setProgress(((currentAgentIndex + 1) / agentTypes.length) * 100);
      
      // If this was the last agent, save the complete session
      if (currentAgentIndex === agentTypes.length - 1 && sessionId) {
        saveAdvisorySession({
          id: sessionId,
          input: farmInputData,
          outputs: [...agentOutputs, result],
          timestamp: Date.now()
        });
        
        toast({
          title: "Advisory process complete",
          description: "All agents have provided their recommendations",
        });
      }
    } catch (error) {
      console.error("Error processing agent:", error);
      toast({
        title: "Agent processing error",
        description: "There was an error processing the agent output",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getFarmerOutput = () => agentOutputs.find(o => o.agent_type === "farmer_advisor") as FarmerAdvisorOutput | undefined;
  const getMarketOutput = () => agentOutputs.find(o => o.agent_type === "market_researcher") as MarketResearcherOutput | undefined;
  const getWeatherOutput = () => agentOutputs.find(o => o.agent_type === "weather_analyst") as WeatherAnalystOutput | undefined;
  const getAgriExpertOutput = () => agentOutputs.find(o => o.agent_type === "agri_expert") as AgriExpertOutput | undefined;

  if (!farmInputData) {
    return (
      <div className="container mx-auto py-12 px-4 flex justify-center">
        <div className="glass-card p-8 rounded-xl text-center animate-pulse-slow">
          <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-medium mb-2">Loading farm data...</h2>
          <p className="text-muted-foreground">Please wait while we retrieve your farm information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-2 text-gradient">Agent Output Analysis</h1>
      <p className="text-muted-foreground mb-8">
        Multi-agent analysis of your farm data, market conditions, and weather patterns.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
        <div className="lg:col-span-1">
          <div className="glass-card rounded-xl p-6 sticky top-20">
            <h2 className="text-lg font-medium mb-4">Advisory Process</h2>
            <Progress value={progress} className="h-2 mb-6" />
            <AgentStepper currentStep={currentAgentIndex} />
          </div>
        </div>
        
        <div className="lg:col-span-3">
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="farmer" disabled={!getFarmerOutput()}>Farmer</TabsTrigger>
              <TabsTrigger value="market" disabled={!getMarketOutput()}>Market</TabsTrigger>
              <TabsTrigger value="weather" disabled={!getWeatherOutput()}>Weather</TabsTrigger>
              <TabsTrigger value="expert" disabled={!getAgriExpertOutput()}>Expert</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="glass-card rounded-xl p-6">
                <h2 className="text-xl font-medium mb-4">Advisory Summary</h2>
                
                {getAgriExpertOutput() ? (
                  <div className="space-y-6">
                    <div className="bg-secondary/30 rounded-lg p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Final Recommendation</p>
                          <h3 className="text-2xl font-bold text-gradient">
                            {getAgriExpertOutput()?.output.final_crop_recommendation}
                          </h3>
                        </div>
                        
                        <div className="bg-farm-green/20 rounded-full px-6 py-3 flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-farm-green"></div>
                          <span className="font-medium">
                            Sustainability Score: {getAgriExpertOutput()?.output.sustainability_score}/100
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Reasoning:</p>
                        <ul className="space-y-2">
                          {getAgriExpertOutput()?.output.reasoning.map((reason, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <Check className="h-4 w-4 text-farm-green mt-0.5" />
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-secondary/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Farm className="h-5 w-5 text-farm-green" />
                          <h3 className="font-medium">Farm Analysis</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Soil pH: {farmInputData.soilPh}, Moisture: {farmInputData.soilMoisture}%
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Fertilizer Usage</span>
                          <span className="text-sm font-medium">{getFarmerOutput()?.output.fertilizer_usage_kg} kg</span>
                        </div>
                      </div>
                      
                      <div className="bg-secondary/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <LineChart className="h-5 w-5 text-tech-blue" />
                          <h3 className="font-medium">Market Analysis</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Best market crop: {getMarketOutput()?.output.best_crop}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Profitability</span>
                          <span className="text-sm font-medium">
                            ${getMarketOutput()?.output.crop_profitability[getMarketOutput()?.output.best_crop || ""]}
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-secondary/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Cloud className="h-5 w-5 text-sky-400" />
                          <h3 className="font-medium">Weather Analysis</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Forecast: {getWeatherOutput()?.output.weather_forecast.replace('_', ' ')}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Weather Impact</span>
                          <span className="text-sm font-medium">{getWeatherOutput()?.output.weather_impact_score}/100</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="animate-pulse-slow">
                      <Sprout className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        {currentAgentIndex === 0 ? "Starting analysis..." : "Processing data..."}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Agent {currentAgentIndex + 1}/{agentTypes.length} in progress
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => navigate("/insights")}
                  className="flex items-center gap-2 bg-secondary/80 hover:bg-secondary rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                >
                  View Vector Insights
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </TabsContent>
            
            <TabsContent value="farmer">
              {getFarmerOutput() && (
                <div className="glass-card rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-farm-green/20 rounded-lg">
                      <Farm className="h-6 w-6 text-farm-green" />
                    </div>
                    <h2 className="text-xl font-medium">Farmer Advisor Output</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-3">Recommendations</h3>
                        <ul className="space-y-2">
                          {getFarmerOutput()?.output.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-farm-green mt-0.5" />
                              <span className="text-sm">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-3">Crop Suggestion</h3>
                        <div className="bg-secondary/30 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Sprout className="h-5 w-5 text-farm-green" />
                            <span className="font-medium">{getFarmerOutput()?.output.suggested_crop}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Based on your soil conditions and local climate
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Resource Usage Analysis</h3>
                      
                      <div className="space-y-4">
                        <div className="bg-secondary/30 rounded-lg p-4">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">Fertilizer Usage</span>
                            <span className="font-medium">{getFarmerOutput()?.output.fertilizer_usage_kg} kg/hectare</span>
                          </div>
                          <div className="h-2 bg-secondary/80 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-tech-blue"
                              style={{
                                width: `${(getFarmerOutput()?.output.fertilizer_usage_kg || 0) / 2}%`
                              }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="bg-secondary/30 rounded-lg p-4">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">Pesticide Usage</span>
                            <span className="font-medium">{getFarmerOutput()?.output.pesticide_usage_kg} kg/hectare</span>
                          </div>
                          <div className="h-2 bg-secondary/80 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-tech-purple"
                              style={{
                                width: `${(getFarmerOutput()?.output.pesticide_usage_kg || 0) / 0.1}%`
                              }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="bg-secondary/30 rounded-lg p-4">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">Sustainability Score</span>
                            <span className="font-medium">{getFarmerOutput()?.output.sustainability_score}/100</span>
                          </div>
                          <div className="h-2 bg-secondary/80 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-farm-green"
                              style={{
                                width: `${getFarmerOutput()?.output.sustainability_score || 0}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="market">
              {getMarketOutput() && (
                <div className="glass-card rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-tech-blue/20 rounded-lg">
                      <LineChart className="h-6 w-6 text-tech-blue" />
                    </div>
                    <h2 className="text-xl font-medium">Market Researcher Output</h2>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-3">Crop Profitability</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {Object.entries(getMarketOutput()?.output.crop_profitability || {}).map(([crop, profit]) => (
                        <div 
                          key={crop}
                          className={`p-4 rounded-lg ${
                            crop === getMarketOutput()?.output.best_crop 
                              ? "bg-tech-blue/20 border border-tech-blue/50"
                              : "bg-secondary/30"
                          }`}
                        >
                          <h4 className="font-medium mb-1">{crop}</h4>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Profit/Acre</span>
                            <span className="font-medium text-tech-blue">${profit}</span>
                          </div>
                          {crop === getMarketOutput()?.output.best_crop && (
                            <div className="mt-2 flex items-center gap-1 text-xs">
                              <Check className="h-3 w-3 text-tech-blue" />
                              <span className="text-tech-blue font-medium">Best Option</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Demand & Supply Trends</h3>
                    <div className="bg-secondary/30 rounded-lg p-4">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left border-b border-white/10">
                            <th className="pb-2 text-sm font-medium">Crop</th>
                            <th className="pb-2 text-sm font-medium">Trend</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(getMarketOutput()?.output.demand_supply_trends || {}).map(([crop, trend]) => (
                            <tr key={crop} className="border-b border-white/5 last:border-0">
                              <td className="py-3 font-medium">{crop}</td>
                              <td className="py-3 text-sm">{trend}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="weather">
              {getWeatherOutput() && (
                <div className="glass-card rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-sky-400/20 rounded-lg">
                      <Cloud className="h-6 w-6 text-sky-400" />
                    </div>
                    <h2 className="text-xl font-medium">Weather Analyst Output</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-3">Weather Forecast</h3>
                        <div className="bg-secondary/30 rounded-lg p-4 flex items-center gap-4">
                          <div className="p-3 bg-sky-400/20 rounded-full">
                            <Cloud className="h-8 w-8 text-sky-400" />
                          </div>
                          <div>
                            <h4 className="font-medium capitalize">{getWeatherOutput()?.output.weather_forecast.replace('_', ' ')}</h4>
                            <p className="text-sm text-muted-foreground">Next 30-day forecast</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-3">Weather Impact</h3>
                        <div className="bg-secondary/30 rounded-lg p-4">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">Weather Impact Score</span>
                            <span className="font-medium">{getWeatherOutput()?.output.weather_impact_score}/100</span>
                          </div>
                          <div className="h-2 bg-secondary/80 rounded-full overflow-hidden mb-4">
                            <div
                              className="h-full bg-sky-400"
                              style={{
                                width: `${getWeatherOutput()?.output.weather_impact_score || 0}%`
                              }}
                            ></div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            This score indicates how favorable the weather conditions are for your selected crops.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-3">Best Suited Crops</h3>
                        <div className="bg-secondary/30 rounded-lg p-4">
                          <div className="grid grid-cols-2 gap-2">
                            {getWeatherOutput()?.output.best_suited_crops.map((crop, i) => (
                              <div key={i} className="flex items-center gap-2 p-2 bg-secondary/50 rounded-lg">
                                <Sprout className="h-4 w-4 text-farm-green" />
                                <span className="font-medium">{crop}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-3">Recommendations</h3>
                        <ul className="space-y-2">
                          {getWeatherOutput()?.output.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-sky-400 mt-0.5" />
                              <span className="text-sm">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="expert">
              {getAgriExpertOutput() && (
                <div className="glass-card rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                      <Sprout className="h-6 w-6 text-yellow-500" />
                    </div>
                    <h2 className="text-xl font-medium">Agricultural Expert Output</h2>
                  </div>
                  
                  <div className="mb-8">
                    <div className="bg-secondary/30 rounded-lg p-6 mb-6">
                      <h3 className="text-xl font-medium mb-2">Final Recommendation</h3>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-farm-green flex items-center justify-center">
                          <Sprout className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-gradient">
                          {getAgriExpertOutput()?.output.final_crop_recommendation}
                        </span>
                      </div>
                      
                      <div className="flex gap-3 items-center">
                        <div className="bg-farm-green/20 rounded-full px-4 py-2 flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-farm-green"></div>
                          <span className="text-sm font-medium">
                            Sustainability Score: {getAgriExpertOutput()?.output.sustainability_score}/100
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-medium mb-3">Expert Reasoning</h3>
                    <div className="bg-secondary/30 rounded-lg p-6">
                      <div className="space-y-4">
                        {getAgriExpertOutput()?.output.reasoning.map((reason, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-farm-green/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-sm font-medium text-farm-green">{i + 1}</span>
                            </div>
                            <div>
                              <p className="text-sm">{reason}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center bg-tech-blue/10 rounded-lg p-4">
                    <div>
                      <h3 className="font-medium">View Detailed Analysis</h3>
                      <p className="text-sm text-muted-foreground">Explore vector insights and similar farm cases</p>
                    </div>
                    <button
                      onClick={() => navigate("/insights")}
                      className="bg-tech-blue/20 hover:bg-tech-blue/30 text-tech-blue px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <span className="text-sm font-medium">Vector Insights</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AgentOutputPage;
