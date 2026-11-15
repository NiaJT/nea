import { errorToast, successToast } from "@/component/common/Toasts";
import requests from "@/helper/requests";
import type { IApiResponse } from "@/type/auth.type";
import type {
  IDocumentTypeCreatePayload,
  IDocumentTypeUpdatePayload,
} from "@/type/document.type";
import { withSuccess } from "@/utils/withSucess";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const documentTypeKeys = {
  all: ["document-types"] as const,
  list: () => [...documentTypeKeys.all, "list"] as const,
  detail: (id: number) => [...documentTypeKeys.all, "detail", id] as const,
};

export const useDocumentTypes = () =>
  useQuery({
    queryKey: documentTypeKeys.all,
    queryFn: async () => (await requests.documentType.getAll()).data,
    retry: (failureCount, error) => {
      const status = (error as AxiosError).response?.status;
      if (status === 401 || status === 403) return false;
      return failureCount < 2;
    },
  });

export const useDocumentType = (id?: number) =>
  useQuery({
    queryKey: documentTypeKeys.detail(id as number),
    queryFn: async () => (await requests.documentType.getById(id!)).data,
    enabled: id !== undefined && !Number.isNaN(id),
  });

export const useCreateDocumentType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IDocumentTypeCreatePayload) =>
      requests.documentType.createDocType(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: documentTypeKeys.all });
      successToast(
        "Document Type Create",
        withSuccess(res.data.message) ?? "Document type has been created.",
      );
    },
    onError: (error: AxiosError<IApiResponse<null>>) => {
      errorToast("Failed to create document type", error);
    },
  });
};

export const useUpdateDocumentType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: IDocumentTypeUpdatePayload;
    }) => requests.documentType.updateDocumentType(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: documentTypeKeys.all });
      successToast(
        "Document Type Update",
        withSuccess(res.data.message) ?? "Changes have been saved.",
      );
    },
    onError: (err: AxiosError<IApiResponse<null>>) =>
      errorToast("Failed to update document type", err),
  });
};

export const useDeleteDocumentType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => requests.documentType.deleteDocumentType(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: documentTypeKeys.all });
      successToast(
        "Document Type Delete",
        withSuccess(res.data.message) ?? "Document type has been deleted.",
      );
    },
    onError: (err: AxiosError<IApiResponse<null>>) =>
      errorToast("Failed to delete document type", err),
  });
};

export const useToggleDocumentTypeStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      requests.documentType.toggleDocumentTypeStatus(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: documentTypeKeys.all });
      successToast(
        "Status Update",
        withSuccess(res.data.message) ?? "Status has been updated.",
      );
    },
    onError: (err: AxiosError<IApiResponse<null>>) =>
      errorToast("Failed to update document type", err),
  });
};
