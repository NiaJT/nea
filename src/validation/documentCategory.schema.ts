import { DOCUMENT_CATEGORY_STATUSES } from "@/type/packageCategory.type";
import z from "zod";

export const documentCategorySchema = z.object({
  name: z.string().trim().min(1, "Document Type name is required"),
  code: z.string().trim().min(1, "Document Type code is required"),
  status: z.enum(DOCUMENT_CATEGORY_STATUSES, { message: "Status is required" }),
});

export type DocumentCategoryFormValues = z.input<typeof documentCategorySchema>;
export type DocumentCategorySubmitValues = z.output<
  typeof documentCategorySchema
>;
