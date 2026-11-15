import { DOCUMENT_TYPE_STATUSES } from "@/type/document.type";

import z from "zod";

export const documentTypeSchema = z.object({
  name: z.string().trim().min(1, "Document Type name is required"),
  code: z.string().trim().min(1, "Document Type code is required"),
  status: z.enum(DOCUMENT_TYPE_STATUSES, { message: "Status is required" }),
});

export type DocumentTypeFormValues = z.input<typeof documentTypeSchema>;
export type DocumentTypeSubmitValues = z.output<typeof documentTypeSchema>;
