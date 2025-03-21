
import React, { useState } from "react";
import { BellIcon, MenuIcon, SearchIcon, User2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  toggleSidebar: () => void;
  onSearch?: (term: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New bucket created", read: false },
    { id: 2, text: "Object uploaded successfully", read: false },
    { id: 3, text: "Storage limit at 75%", read: true }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

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
            <img 
              src="/lovable-uploads/8137a6f8-2b5b-4f04-982a-0486e5f546cc.png" 
              alt="HostDime Logo" 
              className="h-8" 
            />
            <span className="text-lg font-bold tracking-tight hidden md:block">
              <span className="text-hostdime-orange">Object Storage</span>
            </span>
          </a>
        </div>
        
        <form onSubmit={handleSearch} className="relative max-w-sm w-full hidden md:block">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            type="search" 
            placeholder="Search buckets and objects..." 
            className="pl-9 bg-background border-none" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
        
        <div className="flex items-center gap-2 md:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <BellIcon className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1.5 w-2 h-2 bg-hostdime-orange rounded-full"></span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between p-2">
                <h3 className="font-medium">Notifications</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={markAllAsRead} 
                  className="text-xs text-hostdime-orange hover:text-hostdime-orange/80"
                >
                  Mark all as read
                </Button>
              </div>
              <DropdownMenuSeparator />
              {notifications.length > 0 ? (
                <>
                  {notifications.map((notification) => (
                    <DropdownMenuItem key={notification.id} className="p-3">
                      <div className="flex items-start gap-2">
                        {!notification.read && (
                          <div className="w-2 h-2 mt-1 rounded-full bg-hostdime-orange flex-shrink-0" />
                        )}
                        <div className={!notification.read ? "font-medium" : "text-muted-foreground"}>
                          {notification.text}
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </>
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  No notifications
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="bg-hostdime-light hover:bg-hostdime-light/80 cursor-pointer rounded-full p-0.5">
                <div className="bg-hostdime-orange text-white rounded-full h-8 w-8 flex items-center justify-center">
                  <User2Icon className="h-4 w-4" />
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={() => navigate("/login")}>Log Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
