import { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { FiArrowLeft } from "react-icons/fi";

import PageBreadcrumb from "@/component/userPages/PageBreadcrumb";
import PageHeader from "@/component/userPages/PageHeader";
import FormField from "@/component/userPages/FormField";
import FilterSelect from "@/component/userPages/FilterSelect";
import LightButton from "@/component/common/LightButton";
import DarkButton from "@/component/common/DarkButton";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { SupportingFilesField } from "@/pages/user/document/shared/SupportingFilesField";
import { errorToast } from "@/component/common/Toasts";

import { useDocument, useCreateDecision } from "@/action/useDocuments";
import {
  decisionSchema,
  EMPTY_DECISION_VALUES,
  DECISION_OUTCOME_OPTIONS,
  type DecisionFormValues,
} from "@/validation/decision.schema";

const DocumentDecision = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [supportingFiles, setSupportingFiles] = useState<File[]>([]);

  // Extract IDs from URL query params
  const recommendationId = searchParams.get("recommendationId");
  const documentId = searchParams.get("documentId");

  const { data: docResponse } = useDocument(
    documentId ? Number(documentId) : undefined,
  );
  const doc = docResponse?.data;

  const { mutate: createDecision, isPending } = useCreateDecision();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DecisionFormValues>({
    resolver: zodResolver(decisionSchema),
    defaultValues: EMPTY_DECISION_VALUES,
  });

  const onSubmit = (values: DecisionFormValues) => {
    if (!recommendationId) {
      errorToast("Error", "Recommendation ID is missing from the URL.");
      return;
    }

    createDecision(
      {
        recommendationId: Number(recommendationId),
        payload: {
          outcome: values.outcome,
          rationale: values.rationale.trim(),
          confirmed: values.confirmed,
        },
        supportingFiles,
      },
      {
        onSuccess: () => navigate(-1),
      },
    );
  };

  // Banner text pulls from the recommendation object
  const bannerText = useMemo(() => {
    if (!doc?.recommendation) return "";

    const round = `Round ${doc.recommendation.roundNumber}`;
    const revision = String(doc.revision?.revisionNumber ?? 0).padStart(2, "0");

    // Format "RECOMMEND_APPROVAL" -> "Recommend approval"
    const formattedOutcome = doc.recommendation.outcome
      .split("_")
      .map((word, i) =>
        i === 0
          ? word.charAt(0) + word.slice(1).toLowerCase()
          : word.toLowerCase(),
      )
      .join(" ");

    return `Recommendation: ${formattedOutcome}\nRationale: ${doc.recommendation.rationale}\n${round} · Rev ${revision}`;
  }, [doc]);

  if (!recommendationId) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-red-500">
          Invalid URL: Missing recommendationId.
        </p>
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
            { label: "Decision" },
          ]}
        />
        <PageHeader
          title="Decision"
          description="Action is associated with a specific document revision and review round."
        />
      </div>

      <div className="mb-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex cursor-pointer items-center gap-2 text-[12px] font-bold text-[#126BA3] transition-colors hover:text-[#0E2E4A]"
        >
          <FiArrowLeft className="size-3.5" />
          Back
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col rounded-xl border border-[#E1E9F1] bg-white p-[18px] shadow-[0px_2px_9px_rgba(21,58,97,0.03)]"
      >
        {/* Banner */}
        <div className="mb-6 rounded-lg bg-[#EDF5FB] px-3 py-3">
          <p className="whitespace-pre-line text-xs text-[#506D84]">
            {bannerText}
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {/* Row 1: Decision and Date */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Decision" error={errors.outcome?.message}>
              <Controller
                control={control}
                name="outcome"
                render={({ field }) => (
                  <FilterSelect
                    value={field.value}
                    onChange={field.onChange}
                    options={DECISION_OUTCOME_OPTIONS}
                    placeholder="Select decision"
                    className="h-[41px]! w-full"
                  />
                )}
              />
            </FormField>

            <FormField label="Decision date *">
              <input
                type="text"
                value={format(new Date(), "dd/MM/yyyy")}
                disabled
                className="h-[41px] w-full rounded-lg border border-[#D7E2EC] bg-white px-3 text-sm text-[#243B51]"
              />
            </FormField>
          </div>

          {/* Row 2: Rationale */}
          <FormField
            label="Decision rationale *"
            error={errors.rationale?.message}
          >
            <Controller
              control={control}
              name="rationale"
              render={({ field }) => (
                <Textarea
                  {...field}
                  className="min-h-[80px] rounded-lg border-[#D7E2EC] bg-white"
                  placeholder="Enter decision rationale..."
                />
              )}
            />
          </FormField>

          {/* Row 3: Confirm Checkbox */}
          <Controller
            control={control}
            name="confirmed"
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Checkbox
                  id="confirm-decision"
                  checked={field.value}
                  onCheckedChange={(v) => field.onChange(v === true)}
                  className="size-4 rounded-sm border-[#767676] data-[state=checked]:border-[#0075FF] data-[state=checked]:bg-[#0075FF] data-[state=checked]:text-white"
                />
                <label
                  htmlFor="confirm-decision"
                  className="text-[16px] leading-[19px] tracking-[-0.3125px] text-[#17283C]"
                >
                  Confirm this decision for the displayed revision.
                </label>
              </div>
            )}
          />
          {errors.confirmed && (
            <p className="text-xs text-red-600">{errors.confirmed.message}</p>
          )}

          {/* Row 4: Supporting Evidence */}
          <div className="w-full">
            <FormField label="Supporting evidence">
              <SupportingFilesField
                id="decision-supporting-files"
                label="Upload supporting evidence"
                onChange={setSupportingFiles}
                disabled={isPending}
              />
            </FormField>
          </div>
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
            loadingText="Submitting..."
            disabled={isPending}
          >
            Confirm decision
          </DarkButton>
        </div>
      </form>
    </div>
  );
};

export default DocumentDecision;
