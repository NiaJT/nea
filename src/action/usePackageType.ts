import { errorToast, successToast } from "@/component/common/Toasts";
import requests from "@/helper/requests";
import type { IApiResponse } from "@/type/auth.type";
import type {
  IPackageTypeCreatePayload,
  IPackageTypeUpdatePayload,
} from "@/type/packageType.type";
import { withSuccess } from "@/utils/withSucess";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const packageTypeKeys = {
  all: ["package-types"] as const,
  list: () => [...packageTypeKeys.all, "list"] as const,
  detail: (id: number) => [...packageTypeKeys.all, "detail", id] as const,
};

export const usePackageTypes = () =>
  useQuery({
    queryKey: packageTypeKeys.list(),
    queryFn: async () => (await requests.packageType.getPackageTypes()).data,
    staleTime: 5 * 60 * 1000, // lookup data, rarely changes
    retry: (failureCount, error) => {
      const status = (error as AxiosError).response?.status;
      if (status === 401 || status === 403) return false;
      return failureCount < 2;
    },
  });

export const usePackageType = (id?: number) =>
  useQuery({
    queryKey: packageTypeKeys.detail(id as number),
    queryFn: async () =>
      (await requests.packageType.getPackageTypeById(id!)).data,
    enabled: id !== undefined && !Number.isNaN(id),
  });

export const useCreatePackageType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IPackageTypeCreatePayload) =>
      requests.packageType.createPackageType(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: packageTypeKeys.all });
      successToast("Package Type Create", withSuccess(res.data.message));
    },
    onError: (error: AxiosError<IApiResponse<null>>) => {
      errorToast("Failed to create package type", error);
    },
  });
};

export const useUpdatePackageType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: IPackageTypeUpdatePayload;
    }) => requests.packageType.updatePackageType(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: packageTypeKeys.all });
      successToast("Package Type Update", withSuccess(res.data.message));
    },
    onError: (error: AxiosError<IApiResponse<null>>) => {
      errorToast("Failed to update package type", error);
    },
  });
};

export const useDeletePackageType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => requests.packageType.deletePackageType(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: packageTypeKeys.all });
      successToast("Package Type Delete", withSuccess(res.data.message));
    },
    onError: (error: AxiosError<IApiResponse<null>>) => {
      errorToast("Failed to delete package type", error);
    },
  });
};

export const useTogglePackageTypeStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      requests.packageType.togglePackageTypeStatus(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: packageTypeKeys.all });
      successToast("Status Update", withSuccess(res.data.message));
    },
    onError: (error: AxiosError<IApiResponse<null>>) => {
      errorToast("Failed to update status", error);
    },
  });
};
