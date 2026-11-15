import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiArrowLeft } from "react-icons/fi";

import PageBreadcrumb from "@/component/userPages/PageBreadcrumb";
import PageHeader from "@/component/userPages/PageHeader";
import FormField from "@/component/userPages/FormField";
import FilterSelect from "@/component/userPages/FilterSelect";
import LightButton from "@/component/common/LightButton";
import DarkButton from "@/component/common/DarkButton";
import { Textarea } from "@/components/ui/textarea";
import { SupportingFilesField } from "@/pages/user/document/shared/SupportingFilesField";
import { errorToast } from "@/component/common/Toasts";

import { useCreateRecommendation } from "@/action/useDocuments";
import {
  recommendationSchema,
  EMPTY_RECOMMENDATION_VALUES,
  OUTCOME_OPTIONS,
  type RecommendationFormValues,
} from "@/validation/recommendation.schema";

const RecommendationDocument = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [supportingFiles, setSupportingFiles] = useState<File[]>([]);

  // Read from query params instead of path params
  const revisionId = searchParams.get("revisionId");
  const reviewId = searchParams.get("reviewId");

  const { mutate: createRecommendation, isPending } = useCreateRecommendation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RecommendationFormValues>({
    resolver: zodResolver(recommendationSchema),
    defaultValues: EMPTY_RECOMMENDATION_VALUES,
  });

  const onSubmit = (values: RecommendationFormValues) => {
    if (!revisionId || !reviewId) {
      errorToast("Error", "Missing revisionId or reviewId from the URL.");
      return;
    }

    createRecommendation(
      {
        revisionId: Number(revisionId),
        reviewId: Number(reviewId),
        payload: {
          outcome: values.outcome,
          rationale: values.rationale.trim(),
        },
        supportingFiles,
      },
      {
        onSuccess: () => navigate(`/documents-tracking`),
      },
    );
  };

  // Optional: Guard UI if params are missing
  if (!revisionId || !reviewId) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-red-500">
          Invalid URL: Missing revisionId or reviewId.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-6 shrink-0">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="my-3 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-[#126BA3] transition-colors hover:text-[#0E2E4A]"
        >
          <FiArrowLeft className="size-4" />
          Back
        </button>
        <PageBreadcrumb
          items={[
            { label: "Documents", href: "/documents" },
            { label: "Listing", href: "/documents-tracking" },
            { label: "Recommendation" },
          ]}
        />
        <PageHeader
          title="Recommendation"
          description="Action is associated with a specific document revision and review round."
        />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col rounded-xl border border-[#E1E9F1] bg-white p-[18px] shadow-[0px_2px_9px_rgba(21,58,97,0.03)]"
      >
        <div className="flex flex-col gap-5">
          <div className="max-w-[677.5px]">
            <FormField label="Outcome" error={errors.outcome?.message}>
              <Controller
                control={control}
                name="outcome"
                render={({ field }) => (
                  <FilterSelect
                    value={field.value}
                    onChange={field.onChange}
                    options={OUTCOME_OPTIONS}
                    placeholder="Select outcome"
                    className="h-10.25! w-full"
                  />
                )}
              />
            </FormField>
          </div>

          <FormField
            label="Recommendation rationale *"
            error={errors.rationale?.message}
          >
            <Controller
              control={control}
              name="rationale"
              render={({ field }) => (
                <Textarea
                  {...field}
                  className="min-h-[80px] rounded-lg border-[#D7E2EC] bg-white"
                  placeholder="Enter recommendation rationale..."
                />
              )}
            />
          </FormField>

          <div className="w-full max-w-[677.5px]">
            <FormField label="Supporting evidence">
              <SupportingFilesField
                id="recommendation-supporting-files"
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
            className="w-44 gap-2"
            disabled={isPending}
          >
            Cancel
          </LightButton>
          <DarkButton
            type="submit"
            className="w-44 gap-2"
            loading={isPending}
            loadingText="Submitting..."
            disabled={isPending}
          >
            Recommendation
          </DarkButton>
        </div>
      </form>
    </div>
  );
};

export default RecommendationDocument;
