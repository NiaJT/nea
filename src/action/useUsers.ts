import { errorToast, successToast } from "@/component/common/Toasts";
import requests from "@/helper/requests";
import type { IApiResponse } from "@/type/auth.type";
import type {
  IUserCreatePayload,
  IUserListParams,
  IUserUpdatePayload,
} from "@/type/user.type";
import { withSuccess } from "@/utils/withSucess";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const userKeys = {
  all: ["users"] as const,
  list: (params: IUserListParams) => [...userKeys.all, "list", params] as const,
  detail: (id: number) => [...userKeys.all, "detail", id] as const,
};

const API_PAGE_BASE = 0;

export const useUsers = (
  params: {
    page: number;
    perPage: number;
    search?: string;
    status?: string;
    organizationId?: number;
    roleId?: number;
  },
  options?: { enabled?: boolean },
) => {
  const apiParams: IUserListParams = {
    page: params.page + API_PAGE_BASE,
    perPage: params.perPage,
    search: params.search || undefined,
    status: params.status || undefined,
    organizationId: params.organizationId || undefined,
    roleId: params.roleId || undefined,
  };

  return useQuery({
    queryKey: userKeys.list(apiParams),
    queryFn: async () => (await requests.user.getUsers(apiParams)).data,
    placeholderData: keepPreviousData,
    enabled: options?.enabled ?? true,
    retry: (failureCount, error) => {
      const status = (error as AxiosError).response?.status;
      if (status === 401 || status === 403) return false;
      return failureCount < 2;
    },
  });
};

export const useUser = (id?: number, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: userKeys.detail(id as number),
    queryFn: async () => (await requests.user.getUserById(id!)).data,
    enabled:
      id !== undefined && !Number.isNaN(id) && (options?.enabled ?? true),
  });

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IUserCreatePayload) => requests.user.createUser(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      successToast(
        "User Create",
        withSuccess(res.data.message) ?? "User has been created.",
      );
    },
    onError: (error: AxiosError<IApiResponse<null>>) => {
      errorToast("Failed to create user", error);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IUserUpdatePayload }) =>
      requests.user.updateUser(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      successToast(
        "User Update",
        withSuccess(res.data.message) ?? "User has been updated.",
      );
    },
    onError: (error: AxiosError<IApiResponse<null>>) => {
      errorToast("Failed to update user", error);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => requests.user.deleteUser(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      successToast(
        "User Delete",
        withSuccess(res.data.message) ?? "User has been deleted.",
      );
    },
    onError: (error: AxiosError<IApiResponse<null>>) => {
      errorToast("Failed to delete user", error);
    },
  });
};

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => requests.user.toggleUserStatus(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
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
