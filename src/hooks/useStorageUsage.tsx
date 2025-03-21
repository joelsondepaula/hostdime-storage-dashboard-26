
import { useQuery } from "@tanstack/react-query";
import { fetchUsage } from "@/utils/api";

export const useStorageUsage = () => {
  const {
    data: usage,
    isLoading: isLoadingUsage
  } = useQuery({
    queryKey: ["usage"],
    queryFn: fetchUsage
  });
  
  return {
    usage,
    isLoadingUsage
  };
};
