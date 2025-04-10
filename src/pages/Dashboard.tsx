
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Leaf, LineChart, Droplets, Thermometer } from "lucide-react";
import AgentCard from "@/components/AgentCard";

const Dashboard = () => {
  return (
    <div className="container px-4 mx-auto py-8 max-w-7xl animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
          Data-Driven AI for Sustainable Farming
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Our AI-powered multi-agent system analyzes farm data, market trends, and 
          weather forecasts to provide sustainable and profitable farming recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="dashboard-card">
          <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
            <Leaf className="h-5 w-5 text-farm-green" />
            <span>Sustainable Farming</span>
          </h2>
          <p className="text-muted-foreground mb-6">
            Optimize your agricultural practices for environmental sustainability 
            while maintaining profitability. Our AI takes into account soil health, 
            water usage, and carbon impact.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary/50 rounded-lg p-4">
              <Droplets className="h-6 w-6 text-tech-blue mb-2" />
              <h3 className="font-medium">Water Conservation</h3>
              <p className="text-sm text-muted-foreground">Smart irrigation scheduling</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4">
              <Thermometer className="h-6 w-6 text-tech-blue mb-2" />
              <h3 className="font-medium">Climate Adaptation</h3>
              <p className="text-sm text-muted-foreground">Weather-resilient crop selection</p>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
            <LineChart className="h-5 w-5 text-tech-blue" />
            <span>Market Intelligence</span>
          </h2>
          <p className="text-muted-foreground mb-6">
            Make informed decisions based on current market trends, 
            crop demand, and price forecasts. Our system provides profitability 
            analysis across different crops and markets.
          </p>
          <div className="h-36 bg-secondary/50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Sample Price Trends</p>
              <div className="flex items-end h-16 gap-2 mt-2 justify-center">
                {[40, 65, 45, 70, 55, 85].map((height, i) => (
                  <div 
                    key={i}
                    className="w-4 bg-gradient-to-t from-farm-green to-tech-blue rounded-sm"
                    style={{ height: `${height}%` }}
                  ></div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Past 6 Months</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-medium mb-6">Our Multi-Agent System</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AgentCard 
            type="farmer_advisor" 
            title="Farmer Advisor" 
            description="Analyzes soil, climate, and farm data to suggest optimal crops and practices."
          />
          <AgentCard 
            type="market_researcher" 
            title="Market Researcher" 
            description="Provides insights on crop pricing, demand trends, and profitability forecasts."
          />
          <AgentCard 
            type="weather_analyst" 
            title="Weather Analyst" 
            description="Evaluates weather patterns and climate risks to recommend suitable crops."
          />
          <AgentCard 
            type="agri_expert" 
            title="Agri Expert" 
            description="Combines all insights to deliver final recommendations with sustainability scores."
          />
        </div>
      </div>

      <div className="flex justify-center">
        <Link 
          to="/farmer-input"
          className="bg-gradient-to-r from-farm-green to-tech-blue text-white font-medium py-3 px-8 rounded-full flex items-center gap-2 hover:shadow-lg hover:shadow-farm-green/20 transition-all duration-300"
        >
          Start New Advisory Session <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
