import {
  useCreateDocumentType,
  useDocumentType,
  useUpdateDocumentType,
} from "@/action/useDocumentTypes";
import { getApiErrorMessage } from "@/action/useProjects";
import DarkButton from "@/component/common/DarkButton";
import FormInput from "@/component/common/FormInput";
import LightButton from "@/component/common/LightButton";
import FilterSelect from "@/component/userPages/FilterSelect";
import FormField from "@/component/userPages/FormField";
import PageBreadcrumb from "@/component/userPages/PageBreadcrumb";
import PageHeader from "@/component/userPages/PageHeader";
import {
  DOCUMENT_TYPE_STATUS_OPTIONS,
  type IDocumentTypeCreatePayload,
} from "@/type/document.type";
import {
  documentTypeSchema,
  type DocumentTypeFormValues,
} from "@/validation/documentType.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router";

const EMPTY_DOCUMENT_TYPE_VALUES: DocumentTypeFormValues = {
  name: "",
  code: "",
  status: "" as DocumentTypeFormValues["status"],
};

const AddEditDocumentType = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const title = isEdit ? "Edit Document Type" : "Add Document Type";
  const { data: docTypeRes, isLoading } = useDocumentType(
    isEdit ? Number(id) : undefined,
  );
  const docType = docTypeRes?.data;
  const notFound = isEdit && !isLoading && !docType;

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<DocumentTypeFormValues>({
    resolver: zodResolver(documentTypeSchema),
    defaultValues: EMPTY_DOCUMENT_TYPE_VALUES,
  });

  const createDocumentType = useCreateDocumentType();
  const updateDocumentType = useUpdateDocumentType();

  const onSubmit = async (values: DocumentTypeFormValues) => {
    const payload: IDocumentTypeCreatePayload = {
      name: values.name,
      code: values.code,
      status: values.status,
    };

    try {
      if (isEdit)
        await updateDocumentType.mutateAsync({ id: Number(id), data: payload });
      else await createDocumentType.mutateAsync(payload);
      navigate("/document-type");
    } catch (error) {
      const message = getApiErrorMessage(error);
      if (message?.toLowerCase().includes("code")) {
        setError("code", { message });
      }
    }
  };

  useEffect(() => {
    if (!docType) return;
    reset({
      name: docType.name,
      code: docType.code,
      status: docType.status,
    });
  }, [docType, reset]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0">
        <PageBreadcrumb
          items={[
            { label: "Administration", href: "/" },
            { label: "Document Type", href: "/document-type" },
            { label: title },
          ]}
        />
        <PageHeader
          title={title}
          description={
            isEdit
              ? "Update the document type details."
              : "Create new document type details."
          }
        />
      </div>

      <div className="-mx-1 mt-6 min-h-0 flex-1 overflow-y-auto px-1">
        {notFound ? (
          <div className="mt-10 flex flex-col items-start gap-4">
            <p className="text-gray-600">
              This Document Type could not be found.
            </p>
            <LightButton
              className="w-40"
              onClick={() => navigate("/document-type")}
            >
              Back to Document Type
            </LightButton>
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white p-8">
            <h2 className="text-xl font-semibold text-slate-900">
              Document Type details
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Fields marked * are required. IDs should be assigned by the
              system.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
              <FormField label="Document Type *" error={errors.name?.message}>
                <FormInput
                  {...register("name")}
                  placeholder="Document Type Name"
                />
              </FormField>
              <FormField
                label="Document Type Code *"
                error={errors.name?.message}
              >
                <FormInput
                  {...register("code")}
                  placeholder="Document Type Code"
                />
              </FormField>

              <FormField label="Status *" error={errors.status?.message}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <FilterSelect
                      value={field.value}
                      onChange={field.onChange}
                      options={DOCUMENT_TYPE_STATUS_OPTIONS}
                      placeholder="Select status"
                      className="h-11!"
                    />
                  )}
                />
              </FormField>
            </div>

            <div className="mt-8 flex justify-end gap-4 border-t border-gray-200 pt-6">
              <LightButton
                className="w-60"
                onClick={() => navigate("/document-type")}
              >
                Cancel
              </LightButton>
              <DarkButton
                icon={FiSave}
                className="w-60 gap-2"
                loading={isSubmitting}
                loadingText="Saving..."
                onClick={handleSubmit(onSubmit)}
              >
                Save Document Type
              </DarkButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddEditDocumentType;
