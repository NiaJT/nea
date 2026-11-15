import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FiSave } from "react-icons/fi";

import FormDialog from "@/component/common/FormDialog";
import FormInput from "@/component/common/FormInput";
import LightButton from "@/component/common/LightButton";
import DarkButton from "@/component/common/DarkButton";
import FormField from "@/component/userPages/FormField";
import FilterSelect, {
  type SelectOption,
} from "@/component/userPages/FilterSelect";
import { Textarea } from "@/components/ui/textarea";
import { useDocumentTypes } from "@/action/useDocumentTypes";
import { useDocumentCategories } from "@/action/useDocumentCategory";
import { useUpdateDocument } from "@/action/useDocuments";
import type { IDocument } from "@/type/document.type";

// ─── Schema ──────────────────────────────────────────────────────────────────

const editSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  documentTypeId: z.string().min(1, "Document type is required"),
  categoryId: z.string().min(1, "Category is required"),
});

type EditFormValues = z.infer<typeof editSchema>;

// ─── Props ───────────────────────────────────────────────────────────────────

interface EditDocumentMetadataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: IDocument;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const EditDocumentMetadataDialog = ({
  open,
  onOpenChange,
  document: doc,
}: EditDocumentMetadataDialogProps) => {
  const { data: documentTypesResponse } = useDocumentTypes();
  const { data: categoriesResponse } = useDocumentCategories();
  const { mutate: updateDocument, isPending } = useUpdateDocument();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      title: "",
      description: "",
      documentTypeId: "",
      categoryId: "",
    },
  });

  // Sync form when the dialog opens or the document changes
  useEffect(() => {
    if (open && doc) {
      reset({
        title: doc.title || "",
        description: doc.description || "",
        documentTypeId: doc.documentType?.id?.toString() ?? "",
        // The IDocument interface may have categoryId directly, or a nested category object
        categoryId:
          doc.category?.id?.toString() ?? doc.categoryId?.toString() ?? "",
      });
    }
  }, [open, doc, reset]);

  const documentTypeOptions: SelectOption[] = (
    documentTypesResponse?.data ?? []
  ).map((dt) => ({
    label: dt.name,
    value: String(dt.id),
  }));

  const categoryOptions: SelectOption[] = (categoriesResponse?.data ?? []).map(
    (c) => ({
      label: `${c.code} — ${c.name}`,
      value: String(c.id),
    }),
  );

  const handleFormSubmit = (values: EditFormValues) => {
    updateDocument(
      {
        id: doc.documentId,
        data: {
          title: values.title.trim(),
          description: values.description?.trim() || undefined,
          documentTypeId: Number(values.documentTypeId),
          categoryId: Number(values.categoryId),
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit document metadata"
    >
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex flex-col gap-6"
      >
        <div className="grid grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-2">
          {/* Title */}
          <FormField
            label="Document title"
            error={errors.title?.message}
            className="md:col-span-2"
          >
            <FormInput
              placeholder="Document title"
              disabled={isPending}
              {...register("title")}
            />
          </FormField>

          {/* Document Type */}
          <FormField
            label="Document type"
            error={errors.documentTypeId?.message}
          >
            <Controller
              name="documentTypeId"
              control={control}
              render={({ field }) => (
                <FilterSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={documentTypeOptions}
                  placeholder="Select document type"
                  className="h-11!"
                  disabled={isPending}
                />
              )}
            />
          </FormField>

          {/* Category */}
          <FormField label="Category" error={errors.categoryId?.message}>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <FilterSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={categoryOptions}
                  placeholder="Select category"
                  className="h-11!"
                  disabled={isPending}
                />
              )}
            />
          </FormField>

          {/* Description */}
          <FormField
            label="Description"
            error={errors.description?.message}
            className="md:col-span-2"
          >
            <Textarea
              placeholder="Enter a brief description..."
              className="min-h-24 rounded-lg border-[#D7E2EC] bg-white text-sm"
              disabled={isPending}
              {...register("description")}
            />
          </FormField>
        </div>

        <div className="flex justify-end gap-4">
          <LightButton
            type="button"
            className="w-44"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </LightButton>
          <DarkButton
            type="submit"
            icon={FiSave}
            className="w-44 gap-2"
            loading={isPending}
            loadingText="Saving..."
            disabled={isPending}
          >
            Save Changes
          </DarkButton>
        </div>
      </form>
    </FormDialog>
  );
};
