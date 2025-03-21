
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Mock login - in real app this would call an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store some user info in localStorage for the mock
      localStorage.setItem("user", JSON.stringify({ email }));
      
      toast.success("Logged in successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Failed to log in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gray-50">
      {/* Left side - form */}
      <div className="flex items-center justify-center px-6 py-12 md:px-10 lg:px-20">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="flex justify-center">
              <svg 
                className="h-12 w-12" 
                viewBox="0 0 100 100" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="50" cy="50" r="46" fill="#FF5800" />
                <path 
                  d="M34 66V34H50C56.6 34 62 39.4 62 46C62 52.6 56.6 58 50 58H42V66H34Z" 
                  fill="white" 
                />
                <path 
                  d="M58 66V54H66V66H58Z" 
                  fill="white" 
                />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Access your HostDime Object Storage dashboard
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-sm font-medium text-hostdime-orange hover:text-hostdime-orange/80">
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-hostdime-orange hover:bg-hostdime-orange/90"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
            
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="#" className="font-medium text-hostdime-orange hover:text-hostdime-orange/80">
                Contact sales
              </a>
            </p>
          </form>
        </div>
      </div>
      
      {/* Right side - image/branding */}
      <div className="hidden md:block bg-hostdime-orange relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-hostdime-orange to-hostdime-dark opacity-90"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12">
          <h2 className="text-3xl font-bold mb-6">HostDime Object Storage</h2>
          <div className="max-w-md space-y-4 text-center">
            <p className="text-lg">
              Secure, scalable, and reliable object storage for all your business needs.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Scalable</h3>
                <p className="text-sm text-white/80">Store and retrieve any amount of data, anytime.</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Secure</h3>
                <p className="text-sm text-white/80">Advanced security features to protect your data.</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Reliable</h3>
                <p className="text-sm text-white/80">99.99% uptime with redundant data storage.</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Affordable</h3>
                <p className="text-sm text-white/80">Pay only for what you use with no hidden fees.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
