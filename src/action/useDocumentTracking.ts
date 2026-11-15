import requests from "@/helper/requests";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { IDocumentTrackingParams } from "@/type/document.type";

export const documentTrackingKeys = {
  all: ["document-tracking"] as const,
  list: (params: IDocumentTrackingParams) =>
    [...documentTrackingKeys.all, "list", params] as const,
};

export const useDocumentTracking = (params: IDocumentTrackingParams = {}) =>
  useQuery({
    queryKey: documentTrackingKeys.list(params),
    queryFn: async () =>
      (await requests.documentTracking.getTracking(params)).data,
    placeholderData: keepPreviousData,
  });
