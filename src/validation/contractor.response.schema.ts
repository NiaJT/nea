import { z } from "zod";

export const contractorResponseSchema = z.object({
  responseText: z.string().min(1, "Response is required"),
});

export type ContractorResponseFormValues = z.infer<
  typeof contractorResponseSchema
>;

export const EMPTY_CONTRACTOR_RESPONSE_VALUES: ContractorResponseFormValues = {
  responseText: "",
};
