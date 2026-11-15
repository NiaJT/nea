import { z } from "zod";

export const organizationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Organization name is required")
    .min(3, "Organization name must be at least 3 characters"),
  type: z.string().min(1, "Organization type is required"),
  code: z
    .string()
    .trim()
    .min(1, "Organization code is required")
    .min(2, "Organization code must be at least 2 characters")
    .max(10, "Organization code must be at most 10 characters")
    .regex(
      /^[A-Za-z0-9_-]+$/,
      "Only letters, numbers, hyphens and underscores are allowed",
    ),
  email: z
    .string()
    .trim()
    .min(1, "Contact email is required")
    .email("Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
});

export type OrganizationFormValues = z.infer<typeof organizationSchema>;
