
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Sprout, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-background p-4">
      <div className="glass-card p-8 rounded-xl text-center max-w-md">
        <div className="p-4 bg-tech-blue/20 rounded-full inline-flex mx-auto mb-6">
          <Sprout className="h-12 w-12 text-tech-blue" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gradient">404</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Looks like this crop hasn't been planted yet
        </p>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved to another field.
        </p>
        <Link
          to="/"
          className="bg-gradient-to-r from-farm-green to-tech-blue text-white font-medium py-3 px-6 rounded-full flex items-center gap-2 justify-center hover:shadow-lg hover:shadow-farm-green/20 transition-all duration-300"
        >
          <Home className="h-5 w-5" />
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
