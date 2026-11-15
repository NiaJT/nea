import { errorToast, successToast } from "@/component/common/Toasts";
import requests from "@/helper/requests";
import type { IApiResponse } from "@/type/auth.type";
import type {
  IProjectCreatePayload,
  IProjectListParams,
  IProjectUpdatePayload,
} from "@/type/project.type";
import { withSuccess } from "@/utils/withSucess";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const getApiErrorMessage = (error: unknown) =>
  (error as AxiosError<{ message?: string }>).response?.data?.message;

export const projectKeys = {
  all: ["projects"] as const,
  list: (params: IProjectListParams) =>
    [...projectKeys.all, "list", params] as const,
  detail: (id: number) => [...projectKeys.all, "detail", id] as const,
  statistics: () => [...projectKeys.all, "statistics"] as const,
};

const API_PAGE_BASE = 0;

export const useProjects = (
  params: {
    page: number;
    perPage: number;
    search?: string;
    status?: string;
    consultantId?: number;
  },
  options?: { enabled?: boolean },
) => {
  const apiParams: IProjectListParams = {
    page: params.page + API_PAGE_BASE,
    perPage: params.perPage,
    search: params.search || undefined,
    status: params.status || undefined,
    consultantId: params.consultantId || undefined,
  };

  return useQuery({
    queryKey: projectKeys.list(apiParams),
    queryFn: async () => (await requests.project.getProjects(apiParams)).data,
    placeholderData: keepPreviousData,
    enabled: options?.enabled ?? true,
    retry: (failureCount, error) => {
      const status = (error as AxiosError).response?.status;
      if (status === 401 || status === 403) return false;
      return failureCount < 2;
    },
  });
};

export const useProject = (id?: number, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: projectKeys.detail(id as number),
    queryFn: async () => (await requests.project.getProjectById(id!)).data,
    enabled:
      id !== undefined && !Number.isNaN(id) && (options?.enabled ?? true),
    retry: (failureCount, error) => {
      const status = (error as AxiosError).response?.status;
      if (status === 401 || status === 403 || status === 404) return false;
      return failureCount < 2;
    },
  });

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IProjectCreatePayload) =>
      requests.project.createProject(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      successToast("Project Create", withSuccess(res.data.message));
    },
    onError: (error: AxiosError<IApiResponse<null>>) => {
      errorToast("Failed to create project", error);
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IProjectUpdatePayload }) =>
      requests.project.updateProject(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      successToast("Project Update", withSuccess(res.data.message));
    },
    onError: (error: AxiosError<IApiResponse<null>>) => {
      errorToast("Failed to update project", error);
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => requests.project.deleteProject(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      successToast("Project Delete", withSuccess(res.data.message));
    },
    onError: (error: AxiosError<IApiResponse<null>>) => {
      errorToast("Failed to delete project", error);
    },
  });
};

export const useProjectStatistics = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: projectKeys.statistics(),
    queryFn: async () => (await requests.project.getProjectStatistics()).data,
    enabled: options?.enabled ?? true,
    retry: (failureCount, error) => {
      const status = (error as AxiosError).response?.status;
      if (status === 401 || status === 403) return false;
      return failureCount < 2;
    },
  });

export const useToggleProjectStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => requests.project.toggleProjectStatus(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      successToast("Project Status", res.data.message);
    },
    onError: (error: AxiosError<IApiResponse<null>>) => {
      errorToast("Failed to update project status", error);
    },
  });
};
