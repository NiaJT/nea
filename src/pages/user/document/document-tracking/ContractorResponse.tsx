import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";

import PageBreadcrumb from "@/component/userPages/PageBreadcrumb";
import PageHeader from "@/component/userPages/PageHeader";
import FormField from "@/component/userPages/FormField";
import LightButton from "@/component/common/LightButton";
import DarkButton from "@/component/common/DarkButton";
import { Textarea } from "@/components/ui/textarea";
import { SupportingFilesField } from "@/pages/user/document/shared/SupportingFilesField";
import { errorToast } from "@/component/common/Toasts";
import {
  useDocument,
  useCreateContractorResponse,
} from "@/action/useDocuments";
import requests from "@/helper/requests";

const schema = z.object({
  responses: z.record(z.string(), z.string().trim().min(1, "Required")),
});
type FormValues = z.infer<typeof schema>;

const ContractorResponse = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [supportingFiles, setSupportingFiles] = useState<File[]>([]);

  const documentId = searchParams.get("documentId");
  const revisionId = searchParams.get("revisionId");
  const reviewId = searchParams.get("reviewId");

  const { data: docResponse } = useDocument(
    documentId ? Number(documentId) : undefined,
  );
  const doc = docResponse?.data;

  // Load the review so we can render one field per comment
  const { data: reviewsResponse, isLoading: reviewsLoading } = useQuery({
    queryKey: ["document-reviews", revisionId],
    queryFn: async () => {
      const res = await requests.document.getReviews(Number(revisionId));
      return res.data;
    },
    enabled: !!revisionId,
  });

  const review = useMemo(() => {
    const list = reviewsResponse?.data ?? [];
    return list.find((r) => String(r.id) === String(reviewId)) ?? null;
  }, [reviewsResponse, reviewId]);

  const comments = useMemo(() => review?.comments ?? [], [review]);

  // Only comments WITHOUT an existing contractor response are editable.
  // Already-answered comments are shown read-only.
  const unansweredComments = useMemo(
    () => comments.filter((c) => !c.contractorResponse),
    [comments],
  );

  const allAlreadyAnswered =
    comments.length > 0 && unansweredComments.length === 0;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { responses: {} },
  });

  // Seed the form from existing responses (in case of partial re-entry)
  useEffect(() => {
    const defaults: Record<string, string> = {};
    comments.forEach((c) => {
      defaults[String(c.id)] = c.contractorResponse?.responseText ?? "";
    });
    reset({ responses: defaults });
  }, [comments, reset]);

  const { mutate: submitResponse, isPending } = useCreateContractorResponse();

  const onSubmit = (values: FormValues) => {
    if (!documentId || !revisionId || !reviewId) {
      errorToast("Error", "Missing required IDs from the URL.");
      return;
    }

    const responses = unansweredComments.map((c) => ({
      reviewCommentId: c.id as number,
      responseText: values.responses[String(c.id)]?.trim() ?? "",
    }));

    if (responses.length === 0) {
      errorToast("Nothing to submit", "All comments are already answered.");
      return;
    }

    if (responses.some((r) => !r.responseText)) {
      errorToast("Error", "Every comment must be answered.");
      return;
    }

    submitResponse(
      {
        reviewId: Number(reviewId),
        payload: { responses },
        files: supportingFiles,
      },
      {
        onSuccess: () => navigate(-1),
      },
    );
  };

  if (reviewsLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-gray-500">Loading review…</p>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="flex h-full flex-col items-start gap-4 p-8">
        <p className="text-sm text-gray-600">Review not found.</p>
        <LightButton onClick={() => navigate(-1)}>Back</LightButton>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-6 shrink-0">
        <PageBreadcrumb
          items={[
            { label: "Documents", href: "/documents" },
            { label: "Listing", href: "/documents-tracking" },
            { label: "Contractor response" },
          ]}
        />
        <PageHeader
          title="Contractor response"
          description={
            doc?.documentTrackingId
              ? `${doc.documentTrackingId} · ${doc.title}`
              : "Contractor response"
          }
        />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col rounded-xl border border-[#E1E9F1] bg-white p-[18px] shadow-[0px_2px_9px_rgba(21,58,97,0.03)]"
      >
        <div className="flex flex-col gap-4">
          {comments.map((comment, idx) => {
            const key = String(comment.id);
            const existing = comment.contractorResponse;
            const error = (
              errors.responses as
                | Record<string, { message?: string }>
                | undefined
            )?.[key]?.message;

            return (
              <div
                key={key}
                className="flex flex-col rounded-[10px] border border-[#DCE8F0] p-[15px]"
              >
                <h3 className="text-[16px] font-bold leading-[19px] tracking-[-0.3125px] text-[#17283C]">
                  C-
                  {String(comment.sequenceNumber ?? idx + 1).padStart(
                    2,
                    "0",
                  )} · {comment.finding}
                </h3>
                <p className="mt-1 text-[13px] leading-[21px] tracking-[-0.0761719px] text-[#718499]">
                  {comment.observation}
                </p>

                {existing ? (
                  // Already answered — read-only display
                  <div className="mt-4 rounded-lg border border-[#CBE3F2] bg-[#F2F8FC] p-3">
                    <div className="flex items-center justify-between text-[11px] text-[#6A8296]">
                      <span className="font-bold text-[#126BA3]">
                        Your response
                      </span>
                      <span>
                        {existing.respondedAt
                          ? new Date(existing.respondedAt).toLocaleString()
                          : ""}
                      </span>
                    </div>
                    <p className="mt-1 text-[13px] leading-[21px] text-[#17283C]">
                      {existing.responseText}
                    </p>
                  </div>
                ) : (
                  // Unanswered — editable
                  <div className="mt-4">
                    <FormField
                      label={`Response C-${String(idx + 1).padStart(2, "0")} *`}
                      error={error}
                    >
                      <Controller
                        control={control}
                        name={`responses.${key}`}
                        render={({ field }) => (
                          <Textarea
                            {...field}
                            className="min-h-[80px] rounded-lg border-[#D7E2EC] bg-white"
                            placeholder="Enter your response..."
                            disabled={isPending}
                          />
                        )}
                      />
                    </FormField>
                  </div>
                )}
              </div>
            );
          })}

          {allAlreadyAnswered && (
            <div className="rounded-lg border border-[#D5EAD9] bg-[#F1F9F2] p-3 text-[13px] text-[#2E7D32]">
              All comments have been answered. You can go back.
            </div>
          )}

          <div className="w-full max-w-[677.5px]">
            <FormField label="Supporting evidence">
              <SupportingFilesField
                id="contractor-response-files"
                label="Upload supporting evidence"
                onChange={setSupportingFiles}
                disabled={isPending}
              />
            </FormField>
          </div>
        </div>

        <div className="mt-[22px] flex justify-end gap-2 border-t border-[#E8EEF4] pt-[18px]">
          <LightButton
            type="button"
            onClick={() => navigate(-1)}
            className="h-[39px] w-[77px] justify-center rounded-lg border-[#D7E2EC] text-[16px] font-normal text-[#243B51]"
            disabled={isPending}
          >
            Cancel
          </LightButton>
          <DarkButton
            type="submit"
            className="h-[39px] w-[187px] "
            loading={isPending}
            loadingText="Submitting..."
            disabled={isPending || allAlreadyAnswered}
          >
            Submit responses
          </DarkButton>
        </div>
      </form>
    </div>
  );
};

export default ContractorResponse;
