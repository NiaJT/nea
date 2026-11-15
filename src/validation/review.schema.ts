import { z } from "zod";

export const reviewSchema = z.object({
  reviewDate: z.string(),
  comments: z
    .array(
      z.object({
        finding: z.string().min(1, "Finding is required"),
        observation: z.string().min(1, "Observation is required"),
      }),
    )
    .min(1, "At least one comment/observation is required"),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;

export const EMPTY_REVIEW_VALUES: ReviewFormValues = {
  reviewDate: new Date().toISOString().split("T")[0],
  comments: [{ finding: "", observation: "" }],
};
