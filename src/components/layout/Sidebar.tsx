
import React from "react";
import { 
  LayoutDashboardIcon, 
  DatabaseIcon, 
  FileIcon, 
  HelpCircleIcon, 
  LogOutIcon 
} from "lucide-react";
import { formatBytes } from "@/utils/api";
import { Progress } from "@/components/ui/progress";

interface SidebarProps {
  isOpen: boolean;
  buckets: { name: string }[];
  activeBucket: string | null;
  onSelectBucket: (bucket: string | null) => void;
  storageUsed: number;
  storageTotal: number;
  onMenuItemClick: (item: string) => void;
  activeMenuItem: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  buckets, 
  activeBucket, 
  onSelectBucket,
  storageUsed,
  storageTotal,
  onMenuItemClick,
  activeMenuItem
}) => {
  const storageFree = storageTotal - storageUsed;
  const usagePercentage = Math.round((storageUsed / storageTotal) * 100);
  
  const topMenuItems = [
    { icon: <LayoutDashboardIcon size={18} />, label: "Dashboard", onClick: () => onMenuItemClick("dashboard") },
    { icon: <DatabaseIcon size={18} />, label: "All Buckets", onClick: () => onSelectBucket(null) }
  ];
  
  const bottomMenuItems = [
    { icon: <HelpCircleIcon size={18} />, label: "Help & Support", value: "help" },
  ];
  
  return (
    <aside className={`border-r bg-white flex flex-col overflow-hidden transition-all ${isOpen ? 'w-64' : 'w-0 md:w-20'} h-[calc(100vh-4rem)]`}>
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-1.5">
          {topMenuItems.map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className={`sidebar-item w-full ${
                (activeMenuItem === "dashboard" && item.label === "Dashboard") || 
                (!activeBucket && !activeMenuItem && item.label === "All Buckets") ? 
                "active" : ""
              }`}
            >
              {item.icon}
              <span className={`${!isOpen && 'hidden'}`}>{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="my-6 border-t border-b py-4">
          <h3 className={`text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 ${!isOpen && 'px-1 text-center'}`}>
            {isOpen ? "Your Buckets" : ""}
          </h3>
          <nav className="space-y-1.5">
            {buckets.map((bucket) => (
              <button
                key={bucket.name}
                onClick={() => onSelectBucket(bucket.name)}
                className={`sidebar-item w-full ${activeBucket === bucket.name ? "active" : ""}`}
              >
                <FileIcon size={18} />
                <span className={`truncate ${!isOpen && 'hidden'}`}>{bucket.name}</span>
              </button>
            ))}
          </nav>
        </div>
        
        <nav className="space-y-1.5">
          {bottomMenuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => onMenuItemClick(item.value)}
              className={`sidebar-item w-full ${activeMenuItem === item.value ? "active" : ""}`}
            >
              {item.icon}
              <span className={`${!isOpen && 'hidden'}`}>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
      
      <div className={`p-4 border-t ${!isOpen && 'hidden md:block md:p-2'}`}>
        {isOpen ? (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Storage</span>
              <span className="font-medium">{usagePercentage}%</span>
            </div>
            <Progress value={usagePercentage} className="h-2 bg-gray-200">
              <div className="h-full bg-hostdime-orange" style={{ width: `${usagePercentage}%` }}></div>
            </Progress>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatBytes(storageUsed)} used</span>
              <span>{formatBytes(storageFree)} free</span>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <Progress value={usagePercentage} className="h-1 mb-1 bg-gray-200">
              <div className="h-full bg-hostdime-orange" style={{ width: `${usagePercentage}%` }}></div>
            </Progress>
            <div className="text-xs text-muted-foreground">{usagePercentage}%</div>
          </div>
        )}
        
        <button className={`sidebar-item w-full mt-4 text-destructive hover:bg-destructive/10 ${!isOpen && 'hidden'}`}>
          <LogOutIcon size={18} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
