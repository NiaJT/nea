import requests from "@/helper/requests";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const regionKeys = {
  all: ["regions"] as const,
  list: () => [...regionKeys.all, "list"] as const,
};

export const useRegions = () =>
  useQuery({
    queryKey: regionKeys.list(),
    queryFn: async () => (await requests.region.getRegions()).data,
    staleTime: 1000 * 60 * 60, // regions rarely change
    retry: (failureCount, error) => {
      const status = (error as AxiosError).response?.status;
      if (status === 401 || status === 403) return false;
      return failureCount < 2;
    },
  });
