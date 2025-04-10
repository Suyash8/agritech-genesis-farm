
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, ArrowLeftRight, Brain, Search, ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateMockVectorInsights } from "@/utils/mockData";
import type { VectorInsight } from "@/types";

const mockPrompts = [
  {
    id: "p1",
    agent: "farmer_advisor",
    prompt: "Analyze soil pH 6.5, moisture 50%, temperature 25°C with historical data to recommend optimal crops and sustainable practices.",
    output: "Based on soil analysis and historical data, wheat is recommended with organic fertilizers and drip irrigation to maintain sustainability."
  },
  {
    id: "p2",
    agent: "market_researcher",
    prompt: "Research market conditions for wheat, soybeans, corn in [region] considering current prices, demand trends, and supply forecasts.",
    output: "Wheat shows highest profitability at $1200/acre with strong demand and limited supply, making it the optimal choice for market conditions."
  },
  {
    id: "p3",
    agent: "weather_analyst",
    prompt: "Analyze 30-day weather forecast for [location] and evaluate impact on wheat, soybeans, corn growth cycles.",
    output: "Forecasted mild rain patterns favor wheat and soybean cultivation. Wheat has 65% weather impact score, indicating good alignment with upcoming conditions."
  },
  {
    id: "p4",
    agent: "agri_expert",
    prompt: "Synthesize farm data, market research, and weather analysis to provide final crop recommendation optimizing for sustainability score 'Medium'.",
    output: "Final recommendation: Wheat. Reasoning: highest market profitability, favorable weather conditions, and moderate water requirements align with sustainability goals."
  }
];

const VectorInsightsPage = () => {
  const navigate = useNavigate();
  const [insights, setInsights] = useState<VectorInsight[]>([]);
  const [activeTab, setActiveTab] = useState<string>("similar");
  
  useEffect(() => {
    // Generate mock vector insights
    setInsights(generateMockVectorInsights());
  }, []);

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center gap-2 mb-8">
        <button
          onClick={() => navigate("/agent-output")}
          className="p-2 rounded-lg hover:bg-secondary/80 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-3xl font-bold text-gradient">Vector Insights</h1>
      </div>
      
      <Tabs defaultValue="similar" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="similar">Similar Farms</TabsTrigger>
          <TabsTrigger value="prompts">AI Prompts & Outputs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="similar">
          <div className="glass-card rounded-xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <ArrowLeftRight className="h-5 w-5 text-tech-purple" />
              <h2 className="text-xl font-medium">Similar Farm Insights</h2>
            </div>
            
            <p className="text-muted-foreground mb-6">
              These are farms with similar conditions and characteristics to yours, found using vector embeddings.
              Higher similarity scores indicate closer matches to your specific agricultural scenario.
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-white/10">
                    <th className="pb-4 text-sm font-medium">Similarity</th>
                    <th className="pb-4 text-sm font-medium">Farm</th>
                    <th className="pb-4 text-sm font-medium">Main Crop</th>
                    <th className="pb-4 text-sm font-medium">Region</th>
                    <th className="pb-4 text-sm font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {insights.map((insight) => (
                    <tr key={insight.id} className="border-b border-white/5 last:border-0">
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
                            style={{
                              background: `conic-gradient(#4ade80 ${insight.similarity_score * 100}%, transparent 0)`,
                            }}
                          >
                            <div className="w-7 h-7 rounded-full bg-background flex items-center justify-center">
                              {Math.round(insight.similarity_score * 100)}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            % match
                          </div>
                        </div>
                      </td>
                      <td className="py-4 font-medium">{insight.farm_name}</td>
                      <td className="py-4">{insight.main_crop}</td>
                      <td className="py-4">{insight.region}</td>
                      <td className="py-4 text-sm text-muted-foreground max-w-xs">{insight.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-tech-blue" />
                <h2 className="text-xl font-medium">Vector Search Methodology</h2>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground space-y-4">
              <p>
                Our vector search technology converts your farm data into a multidimensional vector 
                embedding, capturing complex relationships between soil conditions, climate patterns, 
                and agricultural outcomes.
              </p>
              <p>
                These embeddings allow us to find farms with similar characteristics even when the 
                specific metrics differ. The similarity score represents the cosine similarity between 
                vector representations of farms.
              </p>
              <p>
                By learning from similar farms' experiences, you can adapt proven strategies to your 
                specific conditions and avoid common pitfalls.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="prompts">
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Brain className="h-5 w-5 text-tech-purple" />
              <h2 className="text-xl font-medium">AI Processing Logs</h2>
            </div>
            
            <p className="text-muted-foreground mb-6">
              These are the prompts sent to our AI agents and their responses during the advisory process.
              Each agent specializes in a different aspect of agricultural decision-making.
            </p>
            
            <div className="space-y-6">
              {mockPrompts.map((item) => (
                <div key={item.id} className="bg-secondary/30 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-tech-purple/20 rounded-lg">
                      <Clock className="h-4 w-4 text-tech-purple" />
                    </div>
                    <h3 className="font-medium capitalize">{item.agent.replace('_', ' ')}</h3>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Input Prompt:</h4>
                    <div className="bg-secondary/50 rounded-lg p-3 text-sm font-mono">
                      {item.prompt}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Agent Output:</h4>
                    <div className="bg-secondary/50 rounded-lg p-3 text-sm">
                      {item.output}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VectorInsightsPage;
