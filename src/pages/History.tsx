
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Filter, 
  ArrowUpDown, 
  Leaf,
  Sprout, 
  Info,
  RefreshCw
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAdvisorySessions } from "@/utils/mockData";
import type { AdvisorySession } from "@/types";

const HistoryPage = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<AdvisorySession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<AdvisorySession[]>([]);
  const [cropFilter, setCropFilter] = useState<string | null>(null);
  const [sustainabilityFilter, setSustainabilityFilter] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  useEffect(() => {
    // Load sessions from localStorage
    const loadedSessions = getAdvisorySessions();
    setSessions(loadedSessions);
    setFilteredSessions(loadedSessions);
  }, []);
  
  useEffect(() => {
    // Apply filters
    let filtered = [...sessions];
    
    if (cropFilter) {
      filtered = filtered.filter(session => {
        const agriExpert = session.outputs.find(o => o.agent_type === "agri_expert");
        if (agriExpert && "output" in agriExpert) {
          return agriExpert.output.final_crop_recommendation === cropFilter;
        }
        return false;
      });
    }
    
    if (sustainabilityFilter) {
      filtered = filtered.filter(session => {
        return session.input.sustainabilityGoal === sustainabilityFilter;
      });
    }
    
    // Sort by timestamp
    filtered.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.timestamp - b.timestamp;
      } else {
        return b.timestamp - a.timestamp;
      }
    });
    
    setFilteredSessions(filtered);
  }, [sessions, cropFilter, sustainabilityFilter, sortOrder]);
  
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };
  
  const resetFilters = () => {
    setCropFilter(null);
    setSustainabilityFilter(null);
  };
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  const getRecommendedCrop = (session: AdvisorySession) => {
    const agriExpert = session.outputs.find(o => o.agent_type === "agri_expert");
    if (agriExpert && "output" in agriExpert) {
      return agriExpert.output.final_crop_recommendation;
    }
    return "N/A";
  };
  
  const getSustainabilityScore = (session: AdvisorySession) => {
    const agriExpert = session.outputs.find(o => o.agent_type === "agri_expert");
    if (agriExpert && "output" in agriExpert) {
      return agriExpert.output.sustainability_score;
    }
    return "N/A";
  };
  
  const viewSession = (sessionId: string) => {
    navigate(`/agent-output?session=${sessionId}`);
  };
  
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8 text-gradient">Advisory History</h1>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <p className="text-muted-foreground">
            View and manage your past advisory sessions. Select any session to view detailed results.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 bg-secondary/80 hover:bg-secondary rounded-lg px-4 py-2 text-sm font-medium transition-colors">
              <Filter className="h-4 w-4" />
              <span>Crop</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setCropFilter(null)}>
                All Crops
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCropFilter("Wheat")}>
                Wheat
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCropFilter("Soybean")}>
                Soybean
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCropFilter("Corn")}>
                Corn
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCropFilter("Rice")}>
                Rice
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 bg-secondary/80 hover:bg-secondary rounded-lg px-4 py-2 text-sm font-medium transition-colors">
              <Leaf className="h-4 w-4" />
              <span>Sustainability</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSustainabilityFilter(null)}>
                All Levels
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSustainabilityFilter("Low")}>
                Low
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSustainabilityFilter("Medium")}>
                Medium
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSustainabilityFilter("High")}>
                High
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <button
            onClick={toggleSortOrder}
            className="flex items-center gap-2 bg-secondary/80 hover:bg-secondary rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            <ArrowUpDown className="h-4 w-4" />
            <span>{sortOrder === "asc" ? "Oldest First" : "Newest First"}</span>
          </button>
          
          <button
            onClick={resetFilters}
            className="flex items-center gap-2 bg-secondary/80 hover:bg-secondary rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>
      
      {filteredSessions.length > 0 ? (
        <div className="glass-card rounded-xl p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-white/10">
                  <th className="pb-4 text-sm font-medium">Date</th>
                  <th className="pb-4 text-sm font-medium">Farm Conditions</th>
                  <th className="pb-4 text-sm font-medium">Sustainability Goal</th>
                  <th className="pb-4 text-sm font-medium">Recommended Crop</th>
                  <th className="pb-4 text-sm font-medium">Score</th>
                  <th className="pb-4 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.map((session) => (
                  <tr 
                    key={session.id} 
                    className="border-b border-white/5 last:border-0 hover:bg-secondary/20 transition-colors cursor-pointer"
                    onClick={() => viewSession(session.id)}
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(session.timestamp)}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="text-sm">
                        <div>pH: {session.input.soilPh.toFixed(1)}</div>
                        <div className="text-muted-foreground">
                          Moisture: {session.input.soilMoisture}%, Temp: {session.input.temperature}°C
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs 
                        ${session.input.sustainabilityGoal === "High" 
                          ? "bg-farm-green/20 text-farm-green" 
                          : session.input.sustainabilityGoal === "Medium" 
                            ? "bg-yellow-500/20 text-yellow-500" 
                            : "bg-tech-blue/20 text-tech-blue"
                        }`}
                      >
                        <Leaf className="h-3 w-3" />
                        {session.input.sustainabilityGoal}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <Sprout className="h-4 w-4 text-farm-green" />
                        <span className="font-medium">{getRecommendedCrop(session)}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
                          style={{
                            background: `conic-gradient(#4ade80 ${Number(getSustainabilityScore(session))}%, transparent 0)`,
                          }}
                        >
                          <div className="w-6 h-6 rounded-full bg-background flex items-center justify-center">
                            {getSustainabilityScore(session)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <button 
                        className="p-2 hover:bg-secondary rounded-full transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          viewSession(session.id);
                        }}
                      >
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-xl p-12 text-center">
          <Sprout className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-medium mb-2">No advisory sessions found</h2>
          <p className="text-muted-foreground mb-6">
            {cropFilter || sustainabilityFilter
              ? "No sessions match your filter criteria. Try adjusting your filters."
              : "You haven't created any advisory sessions yet. Start your first session to get recommendations."}
          </p>
          {!(cropFilter || sustainabilityFilter) && (
            <button
              onClick={() => navigate("/farmer-input")}
              className="bg-gradient-to-r from-farm-green to-tech-blue text-white font-medium py-3 px-6 rounded-full hover:shadow-lg hover:shadow-farm-green/20 transition-all duration-300"
            >
              Start New Advisory Session
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
