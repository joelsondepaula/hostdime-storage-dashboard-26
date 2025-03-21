
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import BucketList from "@/components/buckets/BucketList";
import ObjectList from "@/components/objects/ObjectList";
import { PageLoader } from "@/components/ui/Loader";
import { Button } from "@/components/ui/button";

import { 
  fetchBuckets, 
  fetchObjects, 
  fetchUsage, 
  createBucket, 
  deleteBucket,
  uploadObject,
  deleteObject
} from "@/utils/api";
import { BarChart3, HardDriveIcon, HelpCircle, LayoutDashboardIcon } from "lucide-react";

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null);
  const [activeMenuItem, setActiveMenuItem] = useState<string | null>(null);
  const queryClient = useQueryClient();
  
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
  
  // Fetch buckets data
  const { 
    data: buckets,
    isLoading: isLoadingBuckets
  } = useQuery({
    queryKey: ["buckets"],
    queryFn: fetchBuckets
  });
  
  // Fetch objects data for selected bucket
  const {
    data: objects,
    isLoading: isLoadingObjects
  } = useQuery({
    queryKey: ["objects", selectedBucket],
    queryFn: () => selectedBucket ? fetchObjects(selectedBucket) : Promise.resolve([]),
    enabled: !!selectedBucket
  });
  
  // Fetch storage usage
  const {
    data: usage,
    isLoading: isLoadingUsage
  } = useQuery({
    queryKey: ["usage"],
    queryFn: fetchUsage
  });
  
  // Create bucket mutation
  const createBucketMutation = useMutation({
    mutationFn: (name: string) => createBucket(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buckets"] });
      queryClient.invalidateQueries({ queryKey: ["usage"] });
    }
  });
  
  // Delete bucket mutation
  const deleteBucketMutation = useMutation({
    mutationFn: (name: string) => deleteBucket(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buckets"] });
      queryClient.invalidateQueries({ queryKey: ["usage"] });
      if (selectedBucket) {
        setSelectedBucket(null);
      }
    }
  });
  
  // Upload object mutation
  const uploadObjectMutation = useMutation({
    mutationFn: ({ bucketName, file }: { bucketName: string, file: File }) => 
      uploadObject(bucketName, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["objects", selectedBucket] });
      queryClient.invalidateQueries({ queryKey: ["buckets"] });
      queryClient.invalidateQueries({ queryKey: ["usage"] });
    }
  });
  
  // Delete object mutation
  const deleteObjectMutation = useMutation({
    mutationFn: ({ bucketName, objectKey }: { bucketName: string, objectKey: string }) => 
      deleteObject(bucketName, objectKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["objects", selectedBucket] });
      queryClient.invalidateQueries({ queryKey: ["buckets"] });
      queryClient.invalidateQueries({ queryKey: ["usage"] });
    }
  });
  
  // Handlers
  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const handleSelectBucket = (bucket: string | null) => {
    setSelectedBucket(bucket);
    setActiveMenuItem(null);
  };
  
  const handleMenuItemClick = (item: string) => {
    setActiveMenuItem(item);
    setSelectedBucket(null);
  };
  
  const handleCreateBucket = async (name: string) => {
    await createBucketMutation.mutateAsync(name);
  };
  
  const handleDeleteBucket = async (name: string) => {
    await deleteBucketMutation.mutateAsync(name);
  };
  
  const handleUploadObject = async (file: File) => {
    if (selectedBucket) {
      await uploadObjectMutation.mutateAsync({ bucketName: selectedBucket, file });
    }
  };
  
  const handleDeleteObject = async (objectKey: string) => {
    if (selectedBucket) {
      await deleteObjectMutation.mutateAsync({ bucketName: selectedBucket, objectKey });
    }
  };

  // Render the appropriate content based on activeMenuItem
  const renderContent = () => {
    if (isLoadingBuckets || isLoadingUsage) {
      return <PageLoader />;
    }

    if (selectedBucket) {
      return (
        <ObjectList 
          bucketName={selectedBucket}
          objects={objects}
          isLoading={isLoadingObjects}
          onBack={() => setSelectedBucket(null)}
          onObjectUpload={handleUploadObject}
          onObjectDelete={handleDeleteObject}
        />
      );
    }

    if (activeMenuItem) {
      switch (activeMenuItem) {
        case 'dashboard':
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
                        onClick={() => setSelectedBucket(bucket.name)}
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
        case 'analytics':
          return (
            <div className="flex flex-col items-center justify-center h-full space-y-4 text-center p-6">
              <BarChart3 className="w-16 h-16 text-hostdime-orange" />
              <h1 className="text-2xl font-bold">Análises</h1>
              <p className="text-muted-foreground max-w-md">
                Obtenha insights sobre o uso de armazenamento, padrões de acesso a objetos e muito mais.
                O recurso de análises estará disponível em breve.
              </p>
            </div>
          );
        case 'help':
          return (
            <div className="flex flex-col items-center justify-center h-full space-y-4 text-center p-6">
              <HelpCircle className="w-16 h-16 text-hostdime-orange" />
              <h1 className="text-2xl font-bold">Ajuda e Suporte</h1>
              <p className="text-muted-foreground max-w-md">
                Acesse documentação, FAQs e recursos de suporte ao cliente.
                Para abrir um chamado, entre em contato com nosso suporte.
              </p>
              <Button className="mt-4 bg-hostdime-orange hover:bg-hostdime-orange/90">
                Abrir Chamado de Suporte
              </Button>
            </div>
          );
        default:
          return <BucketList 
            buckets={buckets}
            isLoading={isLoadingBuckets}
            onBucketSelect={handleSelectBucket}
            onBucketCreate={handleCreateBucket}
            onBucketDelete={handleDeleteBucket}
          />;
      }
    }

    return (
      <BucketList 
        buckets={buckets}
        isLoading={isLoadingBuckets}
        onBucketSelect={handleSelectBucket}
        onBucketCreate={handleCreateBucket}
        onBucketDelete={handleDeleteBucket}
      />
    );
  };
  
  return (
    <div className="flex h-screen flex-col">
      <Navbar toggleSidebar={handleToggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          isOpen={isSidebarOpen}
          buckets={buckets || []}
          activeBucket={selectedBucket}
          onSelectBucket={handleSelectBucket}
          storageUsed={usage?.used || 0}
          storageTotal={usage?.total || 1}
          onMenuItemClick={handleMenuItemClick}
          activeMenuItem={activeMenuItem}
        />
        
        <main className="flex-1 overflow-y-auto p-6 animate-fade-in">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
