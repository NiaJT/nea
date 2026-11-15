import requests from "@/helper/requests";
import type { AxiosError } from "axios";
import type {
  IOrgListParams,
  IOrganizationPayload,
  IOrganizationUpdatePayload,
} from "@/type/organization.type";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { IApiResponse } from "@/type/auth.type";
import { errorToast, successToast } from "@/component/common/Toasts";
import { withSuccess } from "@/utils/withSucess";

export const orgKeys = {
  all: ["orgs"] as const,
  list: (params: IOrgListParams) => [...orgKeys.all, "list", params] as const,
  detail: (id: number) => [...orgKeys.all, "detail", id] as const,
};

export const useOrganizations = (
  params: IOrgListParams,
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: orgKeys.list(params),
    queryFn: async () => (await requests.org.getOrganization(params)).data,
    placeholderData: keepPreviousData,
    retry: (failureCount, error) => {
      const status = (error as AxiosError).response?.status;
      if (status === 401 || status === 403) return false;
      return failureCount < 2;
    },
    enabled: options?.enabled ?? true,
  });

export const useOrganization = (id?: number) =>
  useQuery({
    queryKey: orgKeys.detail(id as number),
    queryFn: async () => (await requests.org.getOrganizationById(id!)).data,
    enabled: id !== undefined,
  });

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IOrganizationPayload) =>
      requests.org.createOrganization(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: orgKeys.all });
      successToast(
        "Organization Create",
        withSuccess(res.data.message) ?? "Organization has been created.",
      );
    },
    onError: (error: AxiosError<IApiResponse<null>>) => {
      errorToast("Failed to create organization", error);
    },
  });
};

export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: IOrganizationUpdatePayload;
    }) => requests.org.updateOrganization(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: orgKeys.all });
      successToast(
        "Organization Update",
        withSuccess(res.data.message) ?? "Organization has been updated.",
      );
    },
    onError: (error: AxiosError<IApiResponse<null>>) => {
      errorToast("Failed to update organization", error);
    },
  });
};

export const useDeleteOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => requests.org.deleteOrganization(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: orgKeys.all });
      successToast(
        "Organization Delete",
        withSuccess(res.data.message) ?? "Organization has been deleted.",
      );
    },
    onError: (error: AxiosError<IApiResponse<null>>) => {
      errorToast("Failed to delete organization", error);
    },
  });
};

export const useToggleOrganizationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => requests.org.toggleOrganizationStatus(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: orgKeys.all });
      successToast(
        "Status Update",
        withSuccess(res.data.message) ?? "Status has been updated.",
      );
    },
    onError: (error: AxiosError<IApiResponse<null>>) => {
      errorToast("Failed to update status", error);
    },
  });
};
