import requests from "@/helper/requests";
import type { AxiosError } from "axios";
import type {
  IActivityListParams,
  IDocumentListParams,
  ICreateRevisionInput,
  IDocument,
  CreateDocumentPayload,
  IDocumentUpdatePayload,
  IDocumentReviewResponse,
  ICreateContractorResponseInput,
} from "@/type/document.type";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { IApiResponse } from "@/type/auth.type";
import { errorToast, successToast } from "@/component/common/Toasts";
import { withSuccess } from "@/utils/withSucess";

export const documentKeys = {
  all: ["documents"] as const,
  list: (params: IDocumentListParams) =>
    [...documentKeys.all, "list", params] as const,
  detail: (id: number) => [...documentKeys.all, "detail", id] as const,
  revisions: (id: number) => [...documentKeys.all, "revisions", id] as const,
  activities: (id: number, params?: IActivityListParams) =>
    [...documentKeys.all, "activities", id, params] as const,
  stats: () => [...documentKeys.all, "stats"] as const,
};

/* -------------------------------------------------------------------------- */
/*  Queries                                                                   */
/* -------------------------------------------------------------------------- */

export const useDocuments = (
  params: IDocumentListParams = {},
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: documentKeys.list(params),
    queryFn: async () => (await requests.document.getDocuments(params)).data,
    placeholderData: keepPreviousData,
    enabled: options?.enabled ?? true,
    retry: (failureCount, error) => {
      const status = (error as AxiosError).response?.status;
      if (status === 401 || status === 403) return false;
      return failureCount < 2;
    },
  });

export const useDocument = (id?: number, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: documentKeys.detail(id as number),
    queryFn: async () => (await requests.document.getDocumentById(id!)).data,
    enabled:
      id !== undefined && !Number.isNaN(id) && (options?.enabled ?? true),
  });

export const useDocumentRevisions = (
  id?: number,
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: documentKeys.revisions(id as number),
    queryFn: async () => (await requests.document.getRevisions(id!)).data,
    enabled:
      id !== undefined && !Number.isNaN(id) && (options?.enabled ?? true),
  });

export const useDocumentActivities = (
  id?: number,
  // TODO: in backend where sending params gives null data but successful response.
  // params: IActivityListParams = { page: 1, per_page: 20 },
) =>
  useQuery({
    queryKey: documentKeys.activities(id as number),
    queryFn: async () =>
      (await requests.document.getDocumentActivities(id!)).data,
    enabled: id !== undefined && !Number.isNaN(id),
    placeholderData: keepPreviousData,
  });

export const useDocumentListingStats = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: documentKeys.stats(),
    queryFn: async () => (await requests.document.getListingStats()).data,
    enabled: options?.enabled ?? true,
  });

/* -------------------------------------------------------------------------- */
/*  Mutations                                                                 */
/* -------------------------------------------------------------------------- */

export const useCreateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IApiResponse<IDocument>, // TData  → onSuccess receives this
    AxiosError<IApiResponse<null>>, // TError → onError receives this
    CreateDocumentPayload // TVariables → mutate() takes this
  >({
    mutationFn: async (input) => {
      const res = await requests.document.createDocument(input);
      // Unwrap AxiosResponse → IApiResponse<IDocument>
      return res.data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: documentKeys.all });
      successToast("Document Create", withSuccess(res.message)); // now correct
    },
    onError: (error) => {
      errorToast(
        "Failed to create document",
        error.response?.data?.message ?? error.message,
      );
    },
  });
};

export const useCreateRevision = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ICreateRevisionInput) =>
      requests.document.createRevision(input),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: documentKeys.all });
      queryClient.invalidateQueries({
        queryKey: documentKeys.detail(variables.documentId),
      });
      queryClient.invalidateQueries({
        queryKey: documentKeys.revisions(variables.documentId),
      });
      successToast(
        "Revision Create",
        withSuccess(res.data.message) ?? "Revision has been created.",
      );
    },
    onError: (error: AxiosError<IApiResponse<null>>) => {
      errorToast("Failed to create revision", error);
    },
  });
};

export const useUpdateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IDocumentUpdatePayload }) =>
      requests.document.updateDocument(id, data),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: documentKeys.all });
      queryClient.invalidateQueries({
        queryKey: documentKeys.detail(variables.id),
      });
      successToast(
        "Document Update",
        withSuccess(res.data.message) ?? "Changes have been saved.",
      );
    },
    onError: (error: AxiosError<IApiResponse<null>>) => {
      errorToast("Failed to update document", error);
    },
  });
};

export interface RegisterSubmissionPayload {
  documentId: number | string;
  remarks: string;
  evidenceFiles: File[];
}

export const useRegisterSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IApiResponse<unknown>,
    AxiosError<IApiResponse<null>>,
    RegisterSubmissionPayload
  >({
    mutationFn: async ({ documentId, remarks, evidenceFiles }) => {
      const res = await requests.document.registerDocumentSubmission(
        documentId,
        { remarks },
        evidenceFiles,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.all });
    },
    onError: (error) => {
      errorToast(
        "Failed to register submission",
        error.response?.data?.message ?? error.message,
      );
    },
  });
};
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IApiResponse<IDocumentReviewResponse>,
    AxiosError<IApiResponse<null>>,
    {
      revisionId: number;
      payload: { comments: { finding: string; observation: string }[] };
      supportingFiles: File[];
    }
  >({
    mutationFn: async ({ revisionId, payload, supportingFiles }) => {
      const res = await requests.document.createReview(
        revisionId,
        payload,
        supportingFiles,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.all });
      successToast("Review submitted", "The review has been recorded.");
    },
    onError: (error) => {
      errorToast(
        "Failed to submit review",
        error.response?.data?.message ?? error.message,
      );
    },
  });
};
export const useCreateRecommendation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      revisionId,
      reviewId,
      payload,
      supportingFiles,
    }: {
      revisionId: number;
      reviewId: number;
      payload: { outcome: string; rationale: string };
      supportingFiles: File[];
    }) =>
      requests.document.createRecommendation(
        revisionId,
        reviewId,
        payload,
        supportingFiles,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.all });
      successToast(
        "Recommendation submitted",
        "The recommendation has been recorded.",
      );
    },
  });
};

export const useCreateDecision = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IApiResponse<unknown>,
    AxiosError<IApiResponse<null>>,
    {
      recommendationId: number;
      payload: { outcome: string; rationale: string; confirmed: boolean };
      supportingFiles: File[];
    }
  >({
    mutationFn: async ({ recommendationId, payload, supportingFiles }) => {
      const res = await requests.document.createDecision(
        recommendationId,
        payload,
        supportingFiles,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.all });
      successToast("Decision confirmed", "The decision has been recorded.");
    },
    onError: (error) => {
      errorToast(
        "Failed to submit decision",
        error.response?.data?.message ?? error.message,
      );
    },
  });
};

export const useCreateContractorResponse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ICreateContractorResponseInput) =>
      requests.document.createContractorResponse(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.all });
      successToast("Response submitted", "Your response has been recorded.");
    },
    onError: (error: AxiosError<IApiResponse<null>>) => {
      errorToast(
        "Failed",
        error?.response?.data?.message ?? "Could not submit the response.",
      );
    },
  });
};

export const useCancelDocument = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IApiResponse<unknown>,
    AxiosError<IApiResponse<null>>,
    { documentId: number; reason: string }
  >({
    mutationFn: async ({ documentId, reason }) => {
      const res = await requests.document.cancelDocument(documentId, {
        reason,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.all });
      successToast("Cancelled", "The submission has been cancelled.");
    },
    onError: (error) => {
      errorToast(
        "Failed",
        error.response?.data?.message ?? "Could not cancel the submission.",
      );
    },
  });
};
