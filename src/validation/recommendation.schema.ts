import { z } from "zod";

export const OUTCOME_OPTIONS = [
  { label: "Recommend approval", value: "RECOMMENDED_APPROVAL" },
  { label: "Recommend rejection", value: "RECOMMENDED_REJECTION" },
  { label: "Recommend resubmission", value: "RECOMMENDED_RESUBMISSION" },
];

export const recommendationSchema = z.object({
  outcome: z.enum([
    "RECOMMENDED_APPROVAL",
    "RECOMMENDED_REJECTION",
    "RECOMMENDED_RESUBMISSION",
  ]),
  rationale: z.string().min(1, "Recommendation rationale is required"),
});
export type RecommendationFormValues = z.infer<typeof recommendationSchema>;

export const EMPTY_RECOMMENDATION_VALUES: RecommendationFormValues = {
  outcome: "RECOMMENDED_APPROVAL",
  rationale: "",
};
