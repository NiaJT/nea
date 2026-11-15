import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";

import PageBreadcrumb from "@/component/userPages/PageBreadcrumb";
import PageHeader from "@/component/userPages/PageHeader";
import FormField from "@/component/userPages/FormField";
import LightButton from "@/component/common/LightButton";
import DarkButton from "@/component/common/DarkButton";
import { SupportingFilesField } from "@/pages/user/document/shared/SupportingFilesField";
import { Textarea } from "@/components/ui/textarea";
import { errorToast } from "@/component/common/Toasts";

import { useCreateReview, useDocument } from "@/action/useDocuments";
import { useFilePreview } from "@/hooks/useFilePreview";
import {
  reviewSchema,
  EMPTY_REVIEW_VALUES,
  type ReviewFormValues,
} from "@/validation/review.schema";

const ReviewDocument = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [supportingFiles, setSupportingFiles] = useState<File[]>([]);

  const revisionId = searchParams.get("revisionId");
  const documentId = searchParams.get("documentId");

  const { data: docResponse, isLoading: isDocLoading } = useDocument(
    documentId ? Number(documentId) : undefined,
  );
  const doc = docResponse?.data;

  const recommendation = doc?.recommendation ?? null;
  const revisionStatus = doc?.revision?.status;

  const { previewFile } = useFilePreview();
  const { mutate: createReview, isPending } = useCreateReview();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: EMPTY_REVIEW_VALUES,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "comments",
  });

  // Redirect once the doc is loaded and a recommendation already exists.
  useEffect(() => {
    if (!doc) return;
    if (!recommendation) return;

    if (revisionStatus === "UNDER_REVIEW") {
      navigate(
        `/documents/recommendation?revisionId=${revisionId}&reviewId=${recommendation.reviewId}`,
        { replace: true },
      );
    } else {
      navigate("/documents-tracking", { replace: true });
    }
  }, [doc, recommendation, revisionStatus, revisionId, navigate]);

  const handlePreview = useCallback(() => {
    if (!doc) return;

    const mainFile = doc.revision?.files?.find((f) => f.fileRole === "MAIN");
    if (!mainFile) {
      errorToast(
        "Preview unavailable",
        "No main file found for this revision.",
      );
      return;
    }

    previewFile({
      documentId: doc.documentId,
      fileId: mainFile.id,
      source: mainFile.source ?? "REVISION",
    });
  }, [doc, previewFile]);

  const onSubmit = (values: ReviewFormValues) => {
    if (!revisionId) {
      errorToast("Error", "Revision ID is missing from the URL.");
      return;
    }

    createReview(
      {
        revisionId: Number(revisionId),
        payload: {
          comments: values.comments.map((c) => ({
            finding: c.finding.trim(),
            observation: c.observation.trim(),
          })),
        },
        supportingFiles,
      },
      {
        onSuccess: (res) => {
          const newReviewId = res.data?.id;
          if (newReviewId) {
            navigate(
              `/documents/recommendation?revisionId=${revisionId}&reviewId=${newReviewId}`,
            );
          } else {
            navigate(-1);
          }
        },
      },
    );
  };

  if (!revisionId) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-red-500">Invalid URL: Missing revisionId.</p>
      </div>
    );
  }

  if (isDocLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-gray-500">Loading document details...</p>
      </div>
    );
  }

  // Block form render while redirect is in progress (avoids flash)
  if (recommendation) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-gray-500">
          {revisionStatus === "UNDER_REVIEW"
            ? "Redirecting to recommendation…"
            : "Redirecting to listing…"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Header */}
      <div className="mb-6 shrink-0">
        <PageBreadcrumb
          items={[
            { label: "Documents", href: "/documents" },
            { label: "Listing", href: "/documents-tracking" },
            { label: "Review" },
          ]}
        />
        <PageHeader
          title="Review"
          description="Action is associated with a specific document revision and review round."
        />
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col rounded-xl border border-[#E1E9F1] bg-white p-[18px] shadow-[0px_2px_9px_rgba(21,58,97,0.03)]"
      >
        {/* Top Banner */}
        <div className="mb-4 rounded-lg bg-[#EDF5FB] px-3 py-3">
          <p className="text-xs text-[#506D84]">
            {doc?.documentTrackingId || "No Tracking ID"}
            {" · "}
            {doc?.revision?.submissionDate
              ? format(new Date(doc.revision.submissionDate), "dd/MM/yyyy")
              : "No Date"}
          </p>
        </div>

        {/* Preview & Date Row */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <LightButton
            type="button"
            onClick={handlePreview}
            className="h-[62px] w-full justify-center rounded-lg border-[#D7E2EC] text-[16px] font-normal text-[#243B51]"
          >
            Preview document
          </LightButton>

          <FormField label="Review date *">
            <input
              type="text"
              value={format(new Date(), "dd/MM/yyyy")}
              disabled
              className="h-[41px] w-full rounded-lg border border-[#D7E2EC] bg-white px-3 text-sm text-[#243B51]"
            />
          </FormField>
        </div>

        {/* Dynamic Comments Section */}
        <div className="flex flex-col gap-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="relative flex flex-col gap-4 rounded-[10px] border border-[#DCE8F0] p-[15px]"
            >
              <h3 className="text-[16px] font-bold leading-[19px] tracking-[-0.3125px] text-[#17283C]">
                Comment {index + 1}
              </h3>

              <FormField
                label="Finding *"
                error={errors.comments?.[index]?.finding?.message}
              >
                <Controller
                  control={control}
                  name={`comments.${index}.finding`}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      className="min-h-[80px] rounded-lg border-[#D7E2EC] bg-white"
                    />
                  )}
                />
              </FormField>

              <FormField
                label="Observation *"
                error={errors.comments?.[index]?.observation?.message}
              >
                <Controller
                  control={control}
                  name={`comments.${index}.observation`}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      className="min-h-[80px] rounded-lg border-[#D7E2EC] bg-white"
                    />
                  )}
                />
              </FormField>

              {index > 0 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute right-4 top-4 text-xs font-medium text-red-600 hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add Comment Button */}
        <div className="mt-4">
          <LightButton
            type="button"
            onClick={() => append({ finding: "", observation: "" })}
            className="h-[39px] w-full max-w-[677.5px] justify-center rounded-lg border-[#D7E2EC] text-[16px] font-normal text-[#243B51]"
          >
            + Add comment / observation
          </LightButton>
        </div>

        {/* Supporting Evidence */}
        <div className="mt-6 w-full max-w-[677.5px]">
          <FormField label="Supporting evidence">
            <SupportingFilesField
              id="review-supporting-files"
              label="Upload the document"
              onChange={setSupportingFiles}
              disabled={isPending}
            />
          </FormField>
        </div>

        {/* Footer Actions */}
        <div className="mt-[22px] flex justify-end gap-2 border-t border-[#E8EEF4] pt-[18px]">
          <LightButton
            type="button"
            onClick={() => navigate(-1)}
            className="w-44 gap-2"
            disabled={isPending}
          >
            Cancel
          </LightButton>
          <DarkButton
            type="submit"
            className="w-44 gap-2"
            loading={isPending}
            loadingText="Reviewing..."
            disabled={isPending}
          >
            Review
          </DarkButton>
        </div>
      </form>
    </div>
  );
};

export default ReviewDocument;
