import { z } from "zod";

export const roleSchema = z.object({
  name: z
    .string()
    .min(1, "Role name is required")
    .max(80, "Role name is too long"),
  organizationId: z.string().min(1, "Organization is required"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(200, "Description is too long"),
});

export type RoleFormValues = z.infer<typeof roleSchema>;
