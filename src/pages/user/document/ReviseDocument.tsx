import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiSave, FiUploadCloud } from "react-icons/fi";

import PageBreadcrumb from "@/component/userPages/PageBreadcrumb";
import PageHeader from "@/component/userPages/PageHeader";
import FormField from "@/component/userPages/FormField";
import FormInput from "@/component/common/FormInput";
import { Textarea } from "@/components/ui/textarea";
import LightButton from "@/component/common/LightButton";
import DarkButton from "@/component/common/DarkButton";
import { useDocument, useCreateRevision } from "@/action/useDocuments";
import {
  documentRevisionSchema,
  EMPTY_DOCUMENT_REVISION_VALUES,
  type DocumentRevisionFormValues,
} from "@/validation/document.schema";
import { errorToast } from "@/component/common/Toasts";

const ReviseDocument = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const numericId = id ? Number(id) : undefined;

  const { data: docResponse, isLoading } = useDocument(numericId);
  const doc = docResponse?.data;

  // State for the single main file
  const [mainFile, setMainFile] = useState<File | null>(null);

  const { mutate: createRevision, isPending } = useCreateRevision();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DocumentRevisionFormValues>({
    resolver: zodResolver(
      documentRevisionSchema,
    ) as Resolver<DocumentRevisionFormValues>,
    defaultValues: EMPTY_DOCUMENT_REVISION_VALUES,
  });

  // Prefill title from the parent document once loaded
  useEffect(() => {
    if (!doc) return;
    reset({
      title: doc.title ?? "",
      remarks: "",
      revisionRemarks: "",
    });
  }, [doc, reset]);

  /* ───────── Derived read-only metadata from parent ───────── */

  const derived = useMemo(() => {
    if (!doc) return null;
    return {
      documentTrackingId: doc.documentTrackingId,
      documentTypeName: doc.documentType.name,
      projectName: doc.project.name,
      packageName: doc.projectPackage.name,
      contractorName: doc.contractor?.orgName ?? "—",
      consultantName: doc.consultant?.orgName ?? "—",
      preparedBy: doc.preparedBy.fullName,
      currentRevision: doc.revisionNumber,
      nextRevision: doc.revisionNumber + 1,
    };
  }, [doc]);

  /* ───────── Submit ───────── */

  const onSubmit = (values: DocumentRevisionFormValues) => {
    if (!doc || !numericId) {
      errorToast("Error", "Document ID is missing.");
      return;
    }

    if (!mainFile) {
      errorToast("Error", "You must upload a new main file for this revision.");
      return;
    }

    createRevision(
      {
        documentId: numericId,
        document: {
          remarks: values.remarks?.trim() || undefined,
          revisionRemarks: values.revisionRemarks.trim(),
        },
        mainFile,
        // 👇 No supportingFiles field
      },
      {
        onSuccess: () => navigate(`/documents/${doc.documentId}`),
      },
    );
  };

  /* ───────── Loading / error ───────── */

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <p className="text-sm text-gray-500">Loading document…</p>
      </div>
    );
  }

  if (!doc || !derived) {
    return (
      <div className="flex h-full flex-col items-start gap-4 p-6">
        <p className="text-sm text-gray-600">Document not found.</p>
        <LightButton
          type="button"
          className="w-44"
          onClick={() => navigate("/documents")}
        >
          Back to Documents
        </LightButton>
      </div>
    );
  }

  /* ───────── Render ───────── */

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0">
        <PageBreadcrumb
          items={[
            { label: "Documents", href: "/documents" },
            { label: "Listing", href: "/documents" },
            { label: doc.title, href: `/documents/${doc.documentId}` },
            { label: `New revision` },
          ]}
        />
        <PageHeader
          title={`New revision: ${doc.title}`}
          description="Create a new revision of this document. You must provide a new main file."
        />
      </div>

      <div className="-mx-1 mt-6 min-h-0 flex-1 overflow-y-auto px-1 pb-6">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,466px)]">
            {/* ─── Left card: metadata ─── */}
            <section className="rounded-xl border border-[#E1E9F1] bg-white p-6 shadow-[0px_2px_9px_rgba(21,58,97,0.03)]">
              <h2 className="text-sm font-bold tracking-tight text-[#17283C]">
                Revision details
              </h2>

              <div className="mt-4 border-l-[3px] border-[#4592BE] bg-[#F0F7FC] px-3 py-2.5">
                <p className="text-xs leading-5 text-[#41677E]">
                  A new revision keeps previous versions traceable. Approval
                  does not carry over to the new revision. You must upload a new
                  main file.
                </p>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2">
                <FormField
                  label="Document title *"
                  error={errors.title?.message}
                  className="md:col-span-2"
                >
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <FormInput
                        disabled
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Document title"
                      />
                    )}
                  />
                </FormField>

                <FormField label="Tracking ID">
                  <FormInput
                    value={derived.documentTrackingId ?? ""}
                    disabled
                    className="bg-[#F7FAFC]"
                  />
                </FormField>

                <FormField label="Document type">
                  <FormInput
                    value={derived.documentTypeName}
                    disabled
                    className="bg-[#F7FAFC]"
                  />
                </FormField>

                <FormField label="Project">
                  <FormInput
                    value={derived.projectName}
                    disabled
                    className="bg-[#F7FAFC]"
                  />
                </FormField>

                <FormField label="Package">
                  <FormInput
                    value={derived.packageName}
                    disabled
                    className="bg-[#F7FAFC]"
                  />
                </FormField>

                <FormField label="Contractor">
                  <FormInput
                    value={derived.contractorName}
                    disabled
                    className="bg-[#F7FAFC]"
                  />
                </FormField>

                <FormField label="Consultant">
                  <FormInput
                    value={derived.consultantName}
                    disabled
                    className="bg-[#F7FAFC]"
                  />
                </FormField>

                <FormField label="Prepared by">
                  <FormInput
                    value={derived.preparedBy}
                    disabled
                    className="bg-[#F7FAFC]"
                  />
                </FormField>

                <FormField label="Revision number">
                  <FormInput
                    value={String(derived.nextRevision).padStart(2, "0")}
                    disabled
                    className="bg-[#F7FAFC]"
                  />
                </FormField>

                <div className="md:col-span-2">
                  <FormField
                    label="Remarks (Optional)"
                    error={errors.remarks?.message}
                  >
                    <Textarea
                      rows={2}
                      className="rounded-lg border-[#D7E2EC] bg-white"
                      {...control.register("remarks")}
                      placeholder="Enter any general remarks..."
                      disabled={isPending}
                    />
                  </FormField>
                </div>

                <div className="md:col-span-2">
                  <FormField
                    label="Revision remarks / changes *"
                    error={errors.revisionRemarks?.message}
                  >
                    <Textarea
                      rows={4}
                      className="rounded-lg border-[#D7E2EC] bg-white"
                      {...control.register("revisionRemarks")}
                      placeholder="Describe what changed in this revision…"
                      disabled={isPending}
                    />
                  </FormField>
                </div>
              </div>
            </section>

            {/* ─── Right card: main file only ─── */}
            <section className="flex flex-col rounded-xl border border-[#E1E9F1] bg-white p-6 shadow-[0px_2px_9px_rgba(21,58,97,0.03)]">
              <h2 className="text-sm font-bold tracking-tight text-[#17283C]">
                Main Document
              </h2>

              <p className="mt-2 text-xs text-[#718499]">
                Upload the updated main file for this revision.
              </p>

              <div className="mt-4">
                {mainFile ? (
                  <div className="flex items-center justify-between gap-3 rounded-lg border-2 border-dashed border-[#BFD3E3] bg-[#F8FBFD] p-4">
                    <span className="truncate text-sm text-[#243B51]">
                      {mainFile.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => setMainFile(null)}
                      className="shrink-0 cursor-pointer text-xs font-semibold text-[#17669D] hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="main-file"
                    className="flex h-24 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-[#D7E2EC] bg-white transition hover:bg-[#F7FAFC]"
                  >
                    <FiUploadCloud className="size-8 text-[#17283C]" />
                    <span className="text-xs font-semibold text-[#17283C]">
                      Upload main file
                    </span>
                    <input
                      id="main-file"
                      type="file"
                      className="hidden"
                      disabled={isPending}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setMainFile(file);
                        e.target.value = "";
                      }}
                    />
                  </label>
                )}
              </div>

              <div className="mt-4 rounded-md bg-[#F0F7FC] px-3 py-2.5 text-xs leading-5 text-[#41677E]">
                Document ID, revision number, submitted by, status and approval
                date are generated from the record and workflow.
              </div>
            </section>
          </div>

          {/* ─── Footer actions ─── */}
          <div className="mt-6 flex justify-end gap-4 border-t border-[#E8EEF4] pt-5">
            <LightButton
              type="button"
              className="h-11 w-56 border-buttonBg text-buttonBg"
              disabled={isPending}
              onClick={() => navigate(`/documents/${doc.documentId}`)}
            >
              Cancel
            </LightButton>

            <DarkButton
              type="submit"
              icon={FiSave}
              className="h-11 w-56 gap-2 bg-buttonBg hover:bg-buttonBg/90"
              loading={isPending}
              loadingText="Submitting…"
              disabled={isPending || !mainFile}
            >
              Submit Revision
            </DarkButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviseDocument;
