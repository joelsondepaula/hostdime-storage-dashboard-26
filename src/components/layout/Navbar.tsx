
import React from "react";
import { BellIcon, MenuIcon, SearchIcon, User2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  return (
    <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-10 h-16">
      <div className="flex items-center justify-between px-4 md:px-6 h-full">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="md:hidden"
          >
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
          
          <a href="/" className="flex items-center gap-2">
            <svg 
              className="h-8 w-8" 
              viewBox="0 0 100 100" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="50" cy="50" r="46" fill="#0066B3" />
              <path 
                d="M34 66V34H50C56.6 34 62 39.4 62 46C62 52.6 56.6 58 50 58H42V66H34Z" 
                fill="white" 
              />
              <path 
                d="M58 66V54H66V66H58Z" 
                fill="white" 
              />
            </svg>
            <span className="text-lg font-bold tracking-tight hidden md:block">
              HostDime <span className="text-hostdime-blue">Object Storage</span>
            </span>
          </a>
        </div>
        
        <div className="relative max-w-sm w-full hidden md:block">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            type="search" 
            placeholder="Search buckets and objects..." 
            className="pl-9 bg-background border-none" 
          />
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <BellIcon className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
            <span className="absolute top-1 right-1.5 w-2 h-2 bg-hostdime-blue rounded-full"></span>
          </Button>
          
          <div className="bg-hostdime-light hover:bg-hostdime-light/80 cursor-pointer rounded-full p-0.5">
            <div className="bg-hostdime-blue text-white rounded-full h-8 w-8 flex items-center justify-center">
              <User2Icon className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
