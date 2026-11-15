import { z } from "zod";

export const documentUploadSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Document title is required")
    .max(200, "Document title is too long"),

  documentTypeId: z.string().min(1, "Document type is required"),

  projectId: z.string().min(1, "Project is required"),

  packageId: z.string().min(1, "Package is required"),

  description: z
    .string()
    .trim()
    .max(500, "Description is too long")
    .optional()
    .or(z.literal("")),

  mainFile: z
    .instanceof(File, { message: "Main document file is required" })
    .nullable()
    .refine((file): file is File => file !== null, {
      message: "Main document file is required",
    }),
  categoryId: z.string().min(1, "Document category is required"),
});

export type DocumentUploadFormValues = z.input<typeof documentUploadSchema>;

export const EMPTY_DOCUMENT_UPLOAD_VALUES: DocumentUploadFormValues = {
  title: "",
  documentTypeId: "",
  projectId: "",
  packageId: "",
  description: "",
  mainFile: null,
  categoryId: "",
};

export interface SubmitValidationContext {
  consultantId: number | null;
  contractorId: number | null;
  currentUserId: number | null | undefined;
}

export interface SubmitValidationResult {
  ok: boolean;
  message?: string;
}

/**
 * Runtime validation performed just before submit. Complements the Zod schema
 * by checking values that only exist after fetching project/user data.
 */
export const validateSubmit = (
  values: DocumentUploadFormValues,
  ctx: SubmitValidationContext,
): SubmitValidationResult => {
  if (!values.mainFile) {
    return { ok: false, message: "Please attach the main document." };
  }

  if (ctx.consultantId === null) {
    return {
      ok: false,
      message: "The selected project has no consultant assigned.",
    };
  }

  if (ctx.contractorId === null) {
    return {
      ok: false,
      message: "The selected package has no contractor assigned.",
    };
  }

  if (ctx.currentUserId === null || ctx.currentUserId === undefined) {
    return {
      ok: false,
      message: "Your session could not be resolved. Please reload.",
    };
  }

  return { ok: true };
};

export const documentRevisionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  remarks: z.string().optional(),
  revisionRemarks: z.string().min(1, "Revision remarks are required"),
});

export type DocumentRevisionFormValues = z.infer<typeof documentRevisionSchema>;

export const EMPTY_DOCUMENT_REVISION_VALUES: DocumentRevisionFormValues = {
  title: "",
  remarks: "",
  revisionRemarks: "",
};
