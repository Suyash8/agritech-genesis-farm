
import { Check, Tractor, LineChart, Cloud, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

interface AgentStepperProps {
  currentStep: number;
}

const agents = [
  {
    id: "farmer_advisor",
    title: "Farmer Advisor",
    icon: Tractor,
    color: "text-farm-green",
  },
  {
    id: "market_researcher",
    title: "Market Researcher",
    icon: LineChart,
    color: "text-tech-blue",
  },
  {
    id: "weather_analyst",
    title: "Weather Analyst",
    icon: Cloud,
    color: "text-sky-400",
  },
  {
    id: "agri_expert",
    title: "Agri Expert",
    icon: Leaf,
    color: "text-yellow-500",
  },
];

const AgentStepper = ({ currentStep }: AgentStepperProps) => {
  return (
    <div className="py-6">
      <div className="flex flex-col space-y-6">
        {agents.map((agent, index) => (
          <div key={agent.id} className="multi-agent-stepper-item">
            <div 
              className={cn(
                "relative flex h-8 w-8 items-center justify-center rounded-full border",
                index <= currentStep 
                  ? "bg-farm-green border-farm-green text-white" 
                  : "border-muted-foreground bg-secondary text-muted-foreground"
              )}
            >
              {index < currentStep ? (
                <Check className="h-4 w-4" />
              ) : (
                <agent.icon className={cn("h-4 w-4", index === currentStep && agent.color)} />
              )}
            </div>
            <div className="ml-2">
              <p className={cn(
                "text-sm font-medium",
                index <= currentStep ? "text-foreground" : "text-muted-foreground"
              )}>
                {agent.title}
              </p>
              {index === currentStep && (
                <p className="text-xs text-muted-foreground animate-pulse-slow">Processing...</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentStepper;
