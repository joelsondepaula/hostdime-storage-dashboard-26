
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchBuckets, createBucket, deleteBucket } from "@/utils/api";

export const useBuckets = () => {
  const queryClient = useQueryClient();
  
  const { 
    data: buckets,
    isLoading: isLoadingBuckets
  } = useQuery({
    queryKey: ["buckets"],
    queryFn: fetchBuckets
  });
  
  const createBucketMutation = useMutation({
    mutationFn: (name: string) => createBucket(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buckets"] });
      queryClient.invalidateQueries({ queryKey: ["usage"] });
    }
  });
  
  const deleteBucketMutation = useMutation({
    mutationFn: (name: string) => deleteBucket(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buckets"] });
      queryClient.invalidateQueries({ queryKey: ["usage"] });
    }
  });
  
  const handleCreateBucket = async (name: string) => {
    await createBucketMutation.mutateAsync(name);
  };
  
  const handleDeleteBucket = async (name: string) => {
    await deleteBucketMutation.mutateAsync(name);
  };
  
  return {
    buckets,
    isLoadingBuckets,
    handleCreateBucket,
    handleDeleteBucket
  };
};
