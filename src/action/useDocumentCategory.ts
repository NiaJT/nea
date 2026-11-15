import { errorToast, successToast } from "@/component/common/Toasts";
import requests from "@/helper/requests";
import type { IApiResponse } from "@/type/auth.type";

import type {
  IDocumentCategoryCreatePayload,
  IDocumentCategoryUpdatePayload,
} from "@/type/packageCategory.type";
import { withSuccess } from "@/utils/withSucess";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const documentCategoryKeys = {
  all: ["document-category"] as const,
  list: () => [...documentCategoryKeys.all, "list"] as const,
  detail: (id: number) => [...documentCategoryKeys.all, "detail", id] as const,
};

export const useDocumentCategories = () =>
  useQuery({
    queryKey: documentCategoryKeys.all,
    queryFn: async () => (await requests.documentCategory.getAll()).data,
    retry: (failureCount, error) => {
      const status = (error as AxiosError).response?.status;
      if (status === 401 || status === 403) return false;
      return failureCount < 2;
    },
  });

export const useDocumentCategory = (id?: number) =>
  useQuery({
    queryKey: documentCategoryKeys.detail(id as number),
    queryFn: async () => (await requests.documentCategory.getById(id!)).data,
    enabled: id !== undefined && !Number.isNaN(id),
  });

export const useCreateDocumentCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IDocumentCategoryCreatePayload) =>
      requests.documentCategory.createDocumentCategory(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: documentCategoryKeys.all });
      successToast(
        "Document Category Create",
        withSuccess(res.data.message) ?? "Document category has been created.",
      );
    },
    onError: (error: AxiosError<IApiResponse<null>>) => {
      errorToast("Failed to create document category", error);
    },
  });
};

export const useUpdateDocumentCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: IDocumentCategoryUpdatePayload;
    }) => requests.documentCategory.updateDocumentCategory(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: documentCategoryKeys.all });
      successToast(
        "Document Category Update",
        withSuccess(res.data.message) ?? "Changes have been saved.",
      );
    },
    onError: (err: AxiosError<IApiResponse<null>>) =>
      errorToast("Failed to update document category", err),
  });
};

export const useDeleteDocumentCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      requests.documentCategory.deleteDocumentCategory(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: documentCategoryKeys.all });
      successToast(
        "Document Category Delete",
        withSuccess(res.data.message) ?? "Document category has been deleted.",
      );
    },
    onError: (err: AxiosError<IApiResponse<null>>) =>
      errorToast("Failed to delete document category", err),
  });
};

export const useToggleDocumentCategoryStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      requests.documentCategory.toggleDocumentCategoryStatus(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: documentCategoryKeys.all });
      successToast(
        "Status Update",
        withSuccess(res.data.message) ?? "Status has been updated.",
      );
    },
    onError: (err: AxiosError<IApiResponse<null>>) =>
      errorToast("Failed to document type", err),
  });
};
