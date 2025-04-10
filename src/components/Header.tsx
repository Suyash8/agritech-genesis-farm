
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setIsDarkMode(savedTheme !== "light");
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode ? "dark" : "light";
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", !isDarkMode);
  };

  return (
    <header className="w-full flex items-center justify-between p-4 bg-black/20 backdrop-blur-md z-10 border-b border-white/10">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-tech-blue to-farm-green flex items-center justify-center">
          <span className="text-white font-bold">AI</span>
        </div>
        <Link to="/" className="text-xl font-semibold text-gradient">
          AgriTech Genesis
        </Link>
      </div>
      
      <nav className="hidden md:flex items-center gap-8">
        <Link to="/" className="text-sm hover:text-farm-green transition-colors">Dashboard</Link>
        <Link to="/farmer-input" className="text-sm hover:text-farm-green transition-colors">New Advisory</Link>
        <Link to="/agent-output" className="text-sm hover:text-farm-green transition-colors">Agent Output</Link>
        <Link to="/insights" className="text-sm hover:text-farm-green transition-colors">Vector Insights</Link>
        <Link to="/history" className="text-sm hover:text-farm-green transition-colors">History</Link>
      </nav>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-secondary transition-colors"
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
};

export default Header;
