
import React from "react";
import { HardDriveIcon, LayoutDashboardIcon, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Bucket, StorageUsage } from "@/utils/api";

interface DashboardProps {
  buckets: Bucket[] | null;
  usage: StorageUsage | null;
  onSelectBucket: (bucket: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ buckets, usage, onSelectBucket }) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Painel</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-hostdime-light rounded-full">
              <HardDriveIcon className="h-6 w-6 text-hostdime-orange" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Armazenamento Total</h3>
              <p className="text-2xl font-bold">{usage ? usage.total / 1024 / 1024 / 1024 : 0} GB</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-hostdime-light rounded-full">
              <LayoutDashboardIcon className="h-6 w-6 text-hostdime-orange" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Total de Buckets</h3>
              <p className="text-2xl font-bold">{buckets ? buckets.length : 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-hostdime-light rounded-full">
              <BarChart3 className="h-6 w-6 text-hostdime-orange" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Armazenamento Usado</h3>
              <p className="text-2xl font-bold">{usage ? Math.round((usage.used / usage.total) * 100) : 0}%</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Buckets Recentes</h2>
        {buckets && buckets.length > 0 ? (
          <div className="space-y-2">
            {buckets.slice(0, 5).map((bucket) => (
              <div 
                key={bucket.name} 
                className="p-3 border rounded-md flex items-center justify-between cursor-pointer hover:bg-gray-50"
                onClick={() => onSelectBucket(bucket.name)}
              >
                <div className="flex items-center gap-2">
                  <HardDriveIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{bucket.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">Visualizar</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Nenhum bucket criado ainda.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
