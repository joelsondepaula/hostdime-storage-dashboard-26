
import React from "react";

interface LoaderProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ 
  size = "medium", 
  className = "" 
}) => {
  const sizeClass = {
    small: "w-4 h-4 border-2",
    medium: "w-8 h-8 border-3",
    large: "w-12 h-12 border-4"
  };

  return (
    <div className={`${sizeClass[size]} rounded-full border-hostdime-blue border-t-transparent animate-spin ${className}`} />
  );
};

export const PageLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
      <Loader size="large" />
      <p className="text-hostdime-blue/70 text-sm font-medium animate-pulse">Loading...</p>
    </div>
  );
};

export default Loader;
