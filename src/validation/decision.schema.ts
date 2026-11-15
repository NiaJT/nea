import { z } from "zod";

export const decisionSchema = z.object({
  outcome: z.enum(["APPROVED", "REJECTED"]),
  rationale: z.string().min(1, "Decision rationale is required"),
  confirmed: z.boolean().refine((val) => val === true, {
    message: "You must confirm this decision for the displayed revision.",
  }),
});

export type DecisionFormValues = z.infer<typeof decisionSchema>;

export const EMPTY_DECISION_VALUES: DecisionFormValues = {
  outcome: "APPROVED",
  rationale: "",
  confirmed: false,
};

export const DECISION_OUTCOME_OPTIONS = [
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
];
