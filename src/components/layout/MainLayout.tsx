
import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Bucket } from "@/utils/api";

interface MainLayoutProps {
  children: React.ReactNode;
  buckets: Bucket[] | null;
  selectedBucket: string | null;
  onSelectBucket: (bucket: string | null) => void;
  storageUsed: number;
  storageTotal: number;
  onMenuItemClick: (item: string) => void;
  activeMenuItem: string | null;
  onSearch?: (term: string) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  buckets,
  selectedBucket,
  onSelectBucket,
  storageUsed,
  storageTotal,
  onMenuItemClick,
  activeMenuItem,
  onSearch
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Responsive sidebar handling
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen flex-col">
      <Navbar toggleSidebar={handleToggleSidebar} onSearch={onSearch} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          isOpen={isSidebarOpen}
          buckets={buckets || []}
          activeBucket={selectedBucket}
          onSelectBucket={onSelectBucket}
          storageUsed={storageUsed}
          storageTotal={storageTotal}
          onMenuItemClick={onMenuItemClick}
          activeMenuItem={activeMenuItem}
        />
        
        <main className="flex-1 overflow-y-auto p-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
