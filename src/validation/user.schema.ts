import { z } from "zod";

export const userSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .min(3, "Full name must be at least 3 characters"),

  username: z
    .string()
    .trim()
    .min(1, "Username is required")
    .min(3, "Username must be at least 3 characters")
    .regex(
      /^[a-zA-Z0-9._]+$/,
      "Only letters, numbers, dots and underscores are allowed",
    ),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),

  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),

  organization: z.string().min(1, "Organization is required"),
  accountStatus: z.string().min(1, "Account status is required"),
  primaryRole: z.string().min(1, "Primary role is required"),
  additionalRoles: z.string().optional(),
  project: z.string().optional(),
  packageIds: z.array(z.string()),
});

export type UserFormValues = z.infer<typeof userSchema>;
