
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchObjects, uploadObject, deleteObject } from "@/utils/api";

export const useObjects = (selectedBucket: string | null) => {
  const queryClient = useQueryClient();
  
  const {
    data: objects,
    isLoading: isLoadingObjects
  } = useQuery({
    queryKey: ["objects", selectedBucket],
    queryFn: () => selectedBucket ? fetchObjects(selectedBucket) : Promise.resolve([]),
    enabled: !!selectedBucket
  });
  
  const uploadObjectMutation = useMutation({
    mutationFn: ({ bucketName, file }: { bucketName: string, file: File }) => 
      uploadObject(bucketName, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["objects", selectedBucket] });
      queryClient.invalidateQueries({ queryKey: ["buckets"] });
      queryClient.invalidateQueries({ queryKey: ["usage"] });
    }
  });
  
  const deleteObjectMutation = useMutation({
    mutationFn: ({ bucketName, objectKey }: { bucketName: string, objectKey: string }) => 
      deleteObject(bucketName, objectKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["objects", selectedBucket] });
      queryClient.invalidateQueries({ queryKey: ["buckets"] });
      queryClient.invalidateQueries({ queryKey: ["usage"] });
    }
  });
  
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
  
  return {
    objects,
    isLoadingObjects,
    handleUploadObject,
    handleDeleteObject
  };
};
