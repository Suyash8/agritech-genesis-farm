
import { Tractor, LineChart, Cloud, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

interface AgentCardProps {
  type: "farmer_advisor" | "market_researcher" | "weather_analyst" | "agri_expert";
  title: string;
  description: string;
  isActive?: boolean;
  onClick?: () => void;
}

const AgentCard = ({ type, title, description, isActive = false, onClick }: AgentCardProps) => {
  const getAgentIcon = () => {
    switch (type) {
      case "farmer_advisor":
        return <Tractor className="h-6 w-6 text-farm-green" />;
      case "market_researcher":
        return <LineChart className="h-6 w-6 text-tech-blue" />;
      case "weather_analyst":
        return <Cloud className="h-6 w-6 text-sky-400" />;
      case "agri_expert":
        return <Leaf className="h-6 w-6 text-yellow-500" />;
    }
  };

  return (
    <div 
      className={cn(
        "agent-card cursor-pointer",
        isActive && "ring-2 ring-farm-green/50"
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-secondary rounded-lg">
          {getAgentIcon()}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default AgentCard;
