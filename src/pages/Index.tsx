
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import BucketList from "@/components/buckets/BucketList";
import ObjectList from "@/components/objects/ObjectList";
import { PageLoader } from "@/components/ui/Loader";

import { 
  fetchBuckets, 
  fetchObjects, 
  fetchUsage, 
  createBucket, 
  deleteBucket,
  uploadObject,
  deleteObject,
  Bucket,
  StorageObject
} from "@/utils/api";
import { AlertCircle, BarChart3, HelpCircle, Settings2, ShieldAlert } from "lucide-react";

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
        case 'analytics':
          return (
            <div className="flex flex-col items-center justify-center h-full space-y-4 text-center p-6">
              <BarChart3 className="w-16 h-16 text-primary" />
              <h1 className="text-2xl font-bold">Analytics</h1>
              <p className="text-muted-foreground max-w-md">
                Get insights into your storage usage, object access patterns, and more.
                The analytics feature is coming soon.
              </p>
            </div>
          );
        case 'settings':
          return (
            <div className="flex flex-col items-center justify-center h-full space-y-4 text-center p-6">
              <Settings2 className="w-16 h-16 text-primary" />
              <h1 className="text-2xl font-bold">Settings</h1>
              <p className="text-muted-foreground max-w-md">
                Configure your account preferences, security settings, and notification options.
                The settings feature is coming soon.
              </p>
            </div>
          );
        case 'access-control':
          return (
            <div className="flex flex-col items-center justify-center h-full space-y-4 text-center p-6">
              <ShieldAlert className="w-16 h-16 text-primary" />
              <h1 className="text-2xl font-bold">Access Control</h1>
              <p className="text-muted-foreground max-w-md">
                Manage permissions, access keys, and security policies for your buckets and objects.
                The access control feature is coming soon.
              </p>
            </div>
          );
        case 'help':
          return (
            <div className="flex flex-col items-center justify-center h-full space-y-4 text-center p-6">
              <HelpCircle className="w-16 h-16 text-primary" />
              <h1 className="text-2xl font-bold">Help & Support</h1>
              <p className="text-muted-foreground max-w-md">
                Access documentation, FAQs, and customer support resources.
                The help and support feature is coming soon.
              </p>
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
