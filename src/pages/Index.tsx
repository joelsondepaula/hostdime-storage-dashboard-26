
import React, { useState } from "react";

import { PageLoader } from "@/components/ui/Loader";
import BucketList from "@/components/buckets/BucketList";
import ObjectList from "@/components/objects/ObjectList";
import Dashboard from "@/components/dashboard/Dashboard";
import Analytics from "@/components/analytics/Analytics";
import Support from "@/components/help/Support";
import MainLayout from "@/components/layout/MainLayout";

import { useBuckets } from "@/hooks/useBuckets";
import { useObjects } from "@/hooks/useObjects";
import { useStorageUsage } from "@/hooks/useStorageUsage";

const Index = () => {
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null);
  const [activeMenuItem, setActiveMenuItem] = useState<string | null>(null);
  
  // Get data and handlers from custom hooks
  const { buckets, isLoadingBuckets, handleCreateBucket, handleDeleteBucket } = useBuckets();
  const { usage, isLoadingUsage } = useStorageUsage();
  const { objects, isLoadingObjects, handleUploadObject, handleDeleteObject } = useObjects(selectedBucket);
  
  // Handlers
  const handleSelectBucket = (bucket: string | null) => {
    setSelectedBucket(bucket);
    setActiveMenuItem(null);
  };
  
  const handleMenuItemClick = (item: string) => {
    setActiveMenuItem(item);
    setSelectedBucket(null);
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
            <Dashboard 
              buckets={buckets} 
              usage={usage}
              onSelectBucket={handleSelectBucket}
            />
          );
        case 'analytics':
          return <Analytics />;
        case 'help':
          return <Support />;
        default:
          return (
            <BucketList 
              buckets={buckets}
              isLoading={isLoadingBuckets}
              onBucketSelect={handleSelectBucket}
              onBucketCreate={handleCreateBucket}
              onBucketDelete={handleDeleteBucket}
            />
          );
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
    <MainLayout
      buckets={buckets}
      selectedBucket={selectedBucket}
      onSelectBucket={handleSelectBucket}
      storageUsed={usage?.used || 0}
      storageTotal={usage?.total || 1}
      onMenuItemClick={handleMenuItemClick}
      activeMenuItem={activeMenuItem}
    >
      {renderContent()}
    </MainLayout>
  );
};

export default Index;
