import requests from "@/helper/requests";
import type { AxiosError } from "axios";
import type {
  IRoleListParams,
  IRolePayload,
  IRoleUpdatePayload,
  IUpdateRolePermissionsPayload,
} from "@/type/role.type";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { IApiResponse } from "@/type/auth.type";
import { errorToast, successToast } from "@/component/common/Toasts";
import { withSuccess } from "@/utils/withSucess";

export const roleKeys = {
  all: ["roles"] as const,
  list: (params: IRoleListParams) => [...roleKeys.all, "list", params] as const,
  detail: (id: number) => [...roleKeys.all, "detail", id] as const,
};

export const useRoles = (
  params: IRoleListParams = {},
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: roleKeys.list(params),
    queryFn: async () => (await requests.role.getRoles(params)).data,
    placeholderData: keepPreviousData,
    enabled: options?.enabled ?? true,
    retry: (failureCount, error) => {
      const status = (error as AxiosError).response?.status;
      if (status === 401 || status === 403) return false;
      return failureCount < 2;
    },
  });

export const useRole = (id?: number, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: roleKeys.detail(id as number),
    queryFn: async () => (await requests.role.getRoleById(id!)).data,
    enabled:
      id !== undefined && !Number.isNaN(id) && (options?.enabled ?? true),
    retry: (failureCount, error) => {
      const status = (error as AxiosError).response?.status;
      if (status === 401 || status === 403) return false;
      return failureCount < 2;
    },
  });

export const useCreateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IRolePayload) => requests.role.createRole(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all });
      successToast(
        "Role Create",
        withSuccess(res.data.message) ?? "Role has been created.",
      );
    },
    onError: (error: AxiosError<IApiResponse<null>>) => {
      errorToast("Failed to create role", error);
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IRoleUpdatePayload }) =>
      requests.role.updateRole(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all });
      successToast(
        "Role Update",
        withSuccess(res.data.message) ?? "Role has been updated.",
      );
    },
    onError: (error: AxiosError<IApiResponse<null>>) => {
      errorToast("Failed to update role", error);
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => requests.role.deleteRole(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all });
      successToast(
        "Role Delete",
        withSuccess(res.data.message) ?? "Role has been deleted.",
      );
    },
    onError: (error: AxiosError<IApiResponse<null>>) => {
      errorToast("Failed to delete role", error);
    },
  });
};

export const useUpdateRolePermissions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: IUpdateRolePermissionsPayload;
    }) => requests.role.updateRolePermissions(id, data),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all });
      queryClient.invalidateQueries({
        queryKey: roleKeys.detail(variables.id),
      });
      successToast(
        "Permissions Update",
        withSuccess(res.data.message) ?? "Permissions have been updated.",
      );
    },
    onError: (error: AxiosError<IApiResponse<null>>) => {
      errorToast("Failed to update permissions", error);
    },
  });
};
