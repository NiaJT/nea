export const DOCUMENT_CATEGORY_STATUSES = ["ACTIVE", "INACTIVE"] as const;

export type DocumentCategoryStatus =
  (typeof DOCUMENT_CATEGORY_STATUSES)[number];

export const DOCUMENT_CATEGORY_STATUS_LABELS: Record<
  DocumentCategoryStatus,
  string
> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
};

export const DOCUMENT_CATEGORY_STATUS_STYLES: Record<
  DocumentCategoryStatus,
  string
> = {
  ACTIVE: "bg-green-100 text-green-700",
  INACTIVE: "bg-[#FCE9E9] text-[#AA3B42]",
};

export const DOCUMENT_CATEGORY_OPTIONS = DOCUMENT_CATEGORY_STATUSES.map(
  (v) => ({
    value: v,
    label: DOCUMENT_CATEGORY_STATUS_LABELS[v],
  }),
);

export const PROJECT_STATUS_STYLES: Record<DocumentCategoryStatus, string> = {
  ACTIVE: "bg-green-100 text-green-800",
  INACTIVE: "bg-slate-100 text-slate-600",
};

export interface IDocumentCategory {
  id: number;
  name: string;
  code: string;
  status: DocumentCategoryStatus;
}
export interface IDocumentCategoryCreatePayload {
  name: string;
  code: string;
  status: DocumentCategoryStatus;
}

export type IDocumentCategoryUpdatePayload =
  Partial<IDocumentCategoryCreatePayload>;
