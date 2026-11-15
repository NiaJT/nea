import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import requests from "@/helper/requests";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  projectsPackages: () => [...dashboardKeys.all, "projects-packages"] as const,
  documents: () => [...dashboardKeys.all, "documents"] as const,
};

const noRetryOnAuth = (failureCount: number, error: unknown) => {
  const status = (error as AxiosError).response?.status;
  if (status === 401 || status === 403) return false;
  return failureCount < 2;
};

export const useDashboardProjectsPackages = () =>
  useQuery({
    queryKey: dashboardKeys.projectsPackages(),
    queryFn: async () => (await requests.dashboard.getProjectsPackages()).data,
    retry: noRetryOnAuth,
  });

export const useDashboardDocuments = () =>
  useQuery({
    queryKey: dashboardKeys.documents(),
    queryFn: async () => (await requests.dashboard.getDocuments()).data,
    retry: noRetryOnAuth,
  });
