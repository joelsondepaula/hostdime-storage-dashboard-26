
import React, { useState, useCallback } from "react";

import { PageLoader } from "@/components/ui/Loader";
import BucketList from "@/components/buckets/BucketList";
import ObjectList from "@/components/objects/ObjectList";
import Dashboard from "@/components/dashboard/Dashboard";
import Support from "@/components/help/Support";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";

import { useBuckets } from "@/hooks/useBuckets";
import { useObjects } from "@/hooks/useObjects";
import { useStorageUsage } from "@/hooks/useStorageUsage";

const Index = () => {
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null);
  const [activeMenuItem, setActiveMenuItem] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  
  // Get data and handlers from custom hooks
  const { buckets, isLoadingBuckets, handleCreateBucket, handleDeleteBucket } = useBuckets();
  const { usage, isLoadingUsage } = useStorageUsage();
  const { objects, isLoadingObjects, handleUploadObject, handleDeleteObject } = useObjects(selectedBucket);
  
  // Handlers
  const handleSelectBucket = (bucket: string | null) => {
    setSelectedBucket(bucket);
    setActiveMenuItem(null);
    setSearchTerm(null);
  };
  
  const handleMenuItemClick = (item: string) => {
    setActiveMenuItem(item);
    setSelectedBucket(null);
    setSearchTerm(null);
  };

  // Search handler
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setActiveMenuItem(null);
  }, []);
  
  // Filter buckets and objects based on search term
  const filteredBuckets = searchTerm && buckets 
    ? buckets.filter(bucket => 
        bucket.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : buckets;

  const filteredObjects = searchTerm && objects 
    ? objects.filter(obj => 
        obj.key.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : objects;

  // Render the appropriate content based on activeMenuItem and searchTerm
  const renderContent = () => {
    if (isLoadingBuckets || isLoadingUsage) {
      return <PageLoader />;
    }

    if (selectedBucket) {
      return (
        <ObjectList 
          bucketName={selectedBucket}
          objects={searchTerm ? filteredObjects : objects}
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
        case 'help':
          return <Support />;
        default:
          return (
            <BucketList 
              buckets={filteredBuckets}
              isLoading={isLoadingBuckets}
              onBucketSelect={handleSelectBucket}
              onBucketCreate={handleCreateBucket}
              onBucketDelete={handleDeleteBucket}
            />
          );
      }
    }

    // If there's a search term but no specific bucket selected, show the bucket list with filtered results
    if (searchTerm) {
      return (
        <>
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Search Results for "{searchTerm}"</h2>
              <Button variant="outline" onClick={() => setSearchTerm(null)}>Clear Search</Button>
            </div>
          </div>
          <BucketList 
            buckets={filteredBuckets}
            isLoading={isLoadingBuckets}
            onBucketSelect={handleSelectBucket}
            onBucketCreate={handleCreateBucket}
            onBucketDelete={handleDeleteBucket}
          />
        </>
      );
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
      onSearch={handleSearch}
    >
      {renderContent()}
    </MainLayout>
  );
};

export default Index;
