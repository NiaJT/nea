import { errorToast, successToast } from "@/component/common/Toasts";
import requests from "@/helper/requests";
import { getApiErrorMessage, projectKeys } from "@/action/useProjects";
import type {
  IPackageCreatePayload,
  IPackageUpdatePayload,
} from "@/type/project.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { IPackageStatusUpdatePayload } from "@/type/packageType.type";
import type { IApiResponse } from "@/type/auth.type";
import { withSuccess } from "@/utils/withSucess";

export const packageKeys = {
  all: ["packages"] as const,
  detail: (id: number) => [...packageKeys.all, "detail", id] as const,
};

export const usePackage = (id?: number, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: packageKeys.detail(id ?? 0),
    queryFn: async () =>
      (await requests.projectPackage.getPackage(id as number)).data,
    enabled:
      id !== undefined && !Number.isNaN(id) && (options?.enabled ?? true),
    retry: (failureCount, error) => {
      const status = (error as AxiosError).response?.status;
      if (status === 401 || status === 403 || status === 404) return false;
      return failureCount < 2;
    },
  });

// packages also appear inside the project detail/list, so refresh both
const useRefresh = () => {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: packageKeys.all });
    qc.invalidateQueries({ queryKey: projectKeys.all });
  };
};

export const useCreatePackage = () => {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: async (data: IPackageCreatePayload) =>
      (await requests.projectPackage.createPackage(data)).data,
    onSuccess: (res) => {
      refresh();
      successToast(
        "Package created",
        withSuccess(res.message) ?? "Package has been saved.",
      );
    },
    onError: (error) =>
      errorToast("Could not create package", getApiErrorMessage(error)),
  });
};

export const useUpdatePackage = () => {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: IPackageUpdatePayload;
    }) => (await requests.projectPackage.updatePackage(id, data)).data,
    onSuccess: (res) => {
      refresh();
      successToast(
        "Package updated",
        withSuccess(res.message) ?? "Changes have been saved.",
      );
    },
    onError: (error) =>
      errorToast("Could not update package", getApiErrorMessage(error)),
  });
};

export const useDeletePackage = () => {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: async (id: number) =>
      (await requests.projectPackage.deletePackage(id)).data,
    onSuccess: (res) => {
      refresh();
      successToast(
        "Package deleted",
        withSuccess(res.message) ?? "Package has been removed.",
      );
    },
    onError: (error) =>
      errorToast("Could not delete package", getApiErrorMessage(error)),
  });
};

export const useUpdatePackageStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      packageId,
      data,
    }: {
      packageId: number;
      data: IPackageStatusUpdatePayload;
    }) => requests.packageType.updatePackageStatus(packageId, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      successToast("Status Update", withSuccess(res.data.message));
    },
    onError: (error: AxiosError<IApiResponse<null>>) => {
      errorToast("Failed to update package status", error);
    },
  });
};
