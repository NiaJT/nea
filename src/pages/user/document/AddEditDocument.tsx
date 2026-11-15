import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Controller, useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiSave } from "react-icons/fi";
import { format } from "date-fns";

import PageBreadcrumb from "@/component/userPages/PageBreadcrumb";
import PageHeader from "@/component/userPages/PageHeader";
import FormField from "@/component/userPages/FormField";
import FormInput from "@/component/common/FormInput";
import FilterSelect, {
  type SelectOption,
} from "@/component/userPages/FilterSelect";
import DarkButton from "@/component/common/DarkButton";
import LightButton from "@/component/common/LightButton";
import { MainFileDropZone } from "@/component/document/FileDropZone";
import { Textarea } from "@/components/ui/textarea";
import { errorToast } from "@/component/common/Toasts";
import { useDocumentTypes } from "@/action/useDocumentTypes";
import { useProjects } from "@/action/useProjects";
import { useCreateDocument } from "@/action/useDocuments";
import { useMe } from "@/action/useAuth";
import {
  documentUploadSchema,
  EMPTY_DOCUMENT_UPLOAD_VALUES,
  validateSubmit,
  type DocumentUploadFormValues,
} from "@/validation/document.schema";
import type {
  IDocument,
  IDocumentProjectPackage,
  IProjectWithPackages,
} from "@/type/document.type";
import { useDocumentCategories } from "@/action/useDocumentCategory";
import { SupportingFilesField } from "./shared/SupportingFilesField";
import type { IApiResponse } from "@/type/auth.type";

const DocumentUpload = () => {
  const navigate = useNavigate();

  const { data: documentTypesResponse } = useDocumentTypes();
  const { data: projectsResponse } = useProjects({ page: 1, perPage: 100 });
  const { data: currentUser } = useMe();
  const { data: documentCategoriesResponse } = useDocumentCategories();

  const documentTypes = useMemo(
    () => documentTypesResponse?.data ?? [],
    [documentTypesResponse?.data],
  );
  const projects = useMemo<IProjectWithPackages[]>(
    () => (projectsResponse?.data ?? []) as IProjectWithPackages[],
    [projectsResponse?.data],
  );

  const categories = useMemo(
    () => documentCategoriesResponse?.data ?? [],
    [documentCategoriesResponse],
  );

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DocumentUploadFormValues>({
    resolver: zodResolver(
      documentUploadSchema,
    ) as Resolver<DocumentUploadFormValues>,
    defaultValues: EMPTY_DOCUMENT_UPLOAD_VALUES,
    mode: "onSubmit",
  });

  const { mutate: createDocument, isPending } = useCreateDocument();

  const projectId = useWatch({ control, name: "projectId" });
  const packageId = useWatch({ control, name: "packageId" });

  const selectedProject = useMemo(
    () => projects.find((p) => String(p.id) === projectId),
    [projects, projectId],
  );

  const selectedPackage = useMemo<IDocumentProjectPackage | null>(() => {
    const packages = (selectedProject as IProjectWithPackages)?.packages;
    return packages?.find((pkg) => String(pkg.id) === packageId) ?? null;
  }, [selectedProject, packageId]);

  const consultantId = selectedProject?.consultant?.id ?? null;
  const contractorId = selectedPackage?.contractor?.id ?? null;

  const documentTypeOptions: SelectOption[] = useMemo(
    () =>
      documentTypes.map((dt) => ({
        label: dt.name,
        value: String(dt.id),
      })),
    [documentTypes],
  );

  const projectOptions: SelectOption[] = useMemo(
    () =>
      projects.map((p) => ({
        label: `${p.code} — ${p.name}`,
        value: String(p.id),
      })),
    [projects],
  );

  const packageOptions: SelectOption[] = useMemo(
    () =>
      (selectedProject?.packages ?? []).map((pkg) => ({
        label: `${pkg.code} — ${pkg.name}`,
        value: String(pkg.id),
      })),
    [selectedProject],
  );

  const categoryOptions: SelectOption[] = useMemo(
    () =>
      (categories ?? []).map((pkg) => ({
        label: `${pkg.code} — ${pkg.name}`,
        value: String(pkg.id),
      })),
    [categories],
  );

  // Supporting files kept as a flat File[] for submission.
  const [supportingFiles, setSupportingFiles] = useState<File[]>([]);

  const onSubmit = (values: DocumentUploadFormValues) => {
    const check = validateSubmit(values, {
      consultantId,
      contractorId,
      currentUserId: currentUser?.id,
    });

    if (!check.ok) {
      errorToast("Cannot submit", check.message ?? "Please check the form.");
      return;
    }

    createDocument(
      {
        document: {
          title: values.title.trim(),
          documentTypeId: Number(values.documentTypeId),
          projectId: Number(values.projectId),
          packageId: Number(values.packageId),
          contractorId: contractorId!,
          consultantId: consultantId!,
          submissionDate: new Date().toISOString().slice(0, 10),
          preparedBy: currentUser!.fullName,
          description: values.description?.trim() || undefined,
          categoryId: Number(values.categoryId),
          reviewerId: null,
        },
        mainFile: values.mainFile!,
        supportingFiles,
      },
      {
        onSuccess: (response) => {
          const newDocumentId = (response as IApiResponse<IDocument>)?.data
            ?.documentId;

          navigate(
            newDocumentId ? `/documents/${newDocumentId}` : "/documents",
          );
        },
      },
    );
  };

  const canSubmit = !isPending;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0">
        <PageBreadcrumb
          items={[
            { label: "Documents", href: "/documents" },
            { label: "Upload document" },
          ]}
        />
        <PageHeader
          title="Upload Document"
          description="Search, manage and trace project documents."
        />
      </div>

      <div className="-mx-1 mt-6 min-h-0 flex-1 overflow-y-auto px-1 pb-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-6"
        >
          <div className="flex flex-wrap items-start gap-6">
            {/* ─── Left card: Document metadata ─── */}
            <div className="w-full rounded-xl border border-[#E1E9F1] bg-white p-4.5 shadow-[0px_2px_9px_rgba(21,58,97,0.03)] lg:flex-1">
              <h2 className="text-sm font-bold leading-4.25 tracking-[-0.1504px] text-[#17283C]">
                Document metadata
              </h2>

              <div className="mt-4.5 grid grid-cols-1 gap-x-4.25 gap-y-4.25 md:grid-cols-2">
                <FormField
                  label="Document title *"
                  error={errors.title?.message}
                >
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <FormInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Document title"
                        disabled={isPending}
                      />
                    )}
                  />
                </FormField>

                {/* Row 2: Type + Category */}
                <FormField
                  label="Document type *"
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
                        allLabel="Select document type"
                        className="h-10!"
                        disabled={isPending}
                      />
                    )}
                  />
                </FormField>

                <FormField
                  label="Category *"
                  error={errors.categoryId?.message}
                >
                  <Controller
                    name="categoryId"
                    control={control}
                    render={({ field }) => (
                      <FilterSelect
                        value={field.value}
                        onChange={field.onChange}
                        options={categoryOptions}
                        allLabel="Select document category"
                        className="h-10!"
                        disabled={isPending}
                      />
                    )}
                  />
                </FormField>

                {/* Row 3: Project + Package */}
                <FormField label="Project *" error={errors.projectId?.message}>
                  <Controller
                    name="projectId"
                    control={control}
                    render={({ field }) => (
                      <FilterSelect
                        value={field.value}
                        onChange={(v) => {
                          field.onChange(v);
                          setValue("packageId", "");
                        }}
                        options={projectOptions}
                        allLabel="Select project"
                        className="h-10!"
                        disabled={isPending}
                      />
                    )}
                  />
                </FormField>

                <FormField label="Package *" error={errors.packageId?.message}>
                  <Controller
                    name="packageId"
                    control={control}
                    render={({ field }) => (
                      <FilterSelect
                        value={field.value}
                        onChange={field.onChange}
                        options={packageOptions}
                        allLabel={
                          selectedProject
                            ? "Select package"
                            : "Select a project first"
                        }
                        className="h-10!"
                        disabled={isPending || !selectedProject}
                      />
                    )}
                  />
                </FormField>

                {/* Row 4: Contractor + Consultant (auto-filled, disabled) */}
                <FormField label="Contractor *">
                  <FormInput
                    value={selectedPackage?.contractor?.name ?? ""}
                    placeholder="Auto-filled from package"
                    disabled
                    className="bg-[#F7FAFC]"
                  />
                </FormField>

                <FormField label="Consultant *">
                  <FormInput
                    value={selectedProject?.consultant?.orgName ?? ""}
                    placeholder="Auto-filled from project"
                    disabled
                    className="bg-[#F7FAFC]"
                  />
                </FormField>

                {/* Row 5: Submission date */}
                <FormField label="Submission date *">
                  <FormInput
                    value={format(new Date(), "dd/MM/yyyy")}
                    disabled
                    className="bg-[#F7FAFC]"
                  />
                </FormField>

                {/* Row 6: Prepared by */}
                <FormField label="Prepared by *">
                  <FormInput
                    value={currentUser?.fullName ?? ""}
                    disabled
                    className="bg-[#F7FAFC]"
                  />
                </FormField>

                {/* Row 7: Descriptions (full width) */}
                <div className="md:col-span-2">
                  <FormField
                    label="Descriptions"
                    error={errors.description?.message}
                  >
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          placeholder=""
                          rows={4}
                          className="rounded-lg border-[#D7E2EC] bg-white text-sm"
                          disabled={isPending}
                        />
                      )}
                    />
                  </FormField>
                </div>
              </div>
            </div>

            {/* ─── Right card: Files & attachments ─── */}
            <div className="w-full rounded-xl border border-[#E1E9F1] bg-white p-4.5 shadow-[0px_2px_9px_rgba(21,58,97,0.03)] lg:w-116.5">
              <h2 className="text-sm font-bold leading-4.25 tracking-[-0.1504px] text-[#17283C]">
                Files &amp; attachments
              </h2>

              <div className="mt-4">
                <Controller
                  name="mainFile"
                  control={control}
                  render={({ field }) => (
                    <>
                      {field.value ? (
                        <div className="flex items-center justify-between gap-3 rounded-[10px] border-2 border-dashed border-[#BFD3E3] bg-[#F8FBFD] p-4">
                          <span className="truncate text-sm text-[#243B51]">
                            {field.value.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => field.onChange(null)}
                            className="shrink-0 cursor-pointer text-xs font-semibold text-buttonBg hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <MainFileDropZone
                          id="main-document"
                          title="Choose the main document *"
                          hint="Allowed types and maximum size follow system configuration."
                          label="Upload the document"
                          onChange={(files) => field.onChange(files[0] ?? null)}
                          disabled={isPending}
                        />
                      )}
                      {errors.mainFile?.message && (
                        <p className="mt-2 text-xs text-red-600">
                          {errors.mainFile.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>

              <div className="mt-3">
                <p className="mb-2 text-xs font-semibold leading-4.25 text-[#17283C]">
                  Supporting attachments
                </p>
                <SupportingFilesField
                  id="supporting-files"
                  label="Upload the document"
                  onChange={setSupportingFiles}
                  disabled={isPending}
                />
              </div>

              <div className="mt-3.75 rounded-[8px] bg-[#F0F7FC] px-3 py-2.5 text-xs leading-4.25 text-[#41677E]">
                Document ID, submitted by, status and approval date are
                generated from the record and workflow.
              </div>
            </div>
          </div>

          {/* ─── Footer actions ─── */}
          <div className="flex flex-wrap justify-end gap-4 border-t border-[#E8EEF4] pt-4.5">
            <LightButton
              type="button"
              className="w-56.5 border-buttonBg text-buttonBg"
              onClick={() => navigate("/documents")}
              disabled={isPending}
            >
              Cancel
            </LightButton>

            <DarkButton
              type="submit"
              icon={FiSave}
              className="w-56.5 gap-2 bg-buttonBg hover:bg-buttonBg/90"
              loading={isPending}
              loadingText="Submitting..."
              disabled={!canSubmit}
            >
              Submit Document
            </DarkButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentUpload;
