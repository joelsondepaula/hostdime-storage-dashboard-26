
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

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null);
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
        />
        
        <main className="flex-1 overflow-y-auto p-6 animate-fade-in">
          {isLoadingBuckets || isLoadingUsage ? (
            <PageLoader />
          ) : selectedBucket ? (
            <ObjectList 
              bucketName={selectedBucket}
              objects={objects}
              isLoading={isLoadingObjects}
              onBack={() => setSelectedBucket(null)}
              onObjectUpload={handleUploadObject}
              onObjectDelete={handleDeleteObject}
            />
          ) : (
            <BucketList 
              buckets={buckets}
              isLoading={isLoadingBuckets}
              onBucketSelect={handleSelectBucket}
              onBucketCreate={handleCreateBucket}
              onBucketDelete={handleDeleteBucket}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
