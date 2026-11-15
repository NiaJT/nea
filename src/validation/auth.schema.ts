import { z } from "zod";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Login
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .regex(EMAIL_REGEX, "Enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export type LoginValues = z.infer<typeof loginSchema>;

// Forgot Password
export const forgotPasswordSchema = loginSchema.pick({ email: true });
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

// Reset Password
export const passwordRules = [
  {
    id: "length",
    label: "At least 8 characters",
    test: (p: string) => p.length >= 8,
  },
  {
    id: "case",
    label: "Contains uppercase and lower case letters",
    test: (p: string) => /[a-z]/.test(p) && /[A-Z]/.test(p),
  },
  {
    id: "number",
    label: "Contains at least one number",
    test: (p: string) => /\d/.test(p),
  },
  {
    id: "special",
    label: "Contains at least one special character (!@#$%)",
    test: (p: string) => /[^A-Za-z0-9]/.test(p),
  },
];

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, "New password is required")
      .refine(
        (p) => passwordRules.every((r) => r.test(p)),
        "Password does not meet all the requirements",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Change Password
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(1, "New password is required"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => passwordRules.every((rule) => rule.test(data.newPassword)),
    {
      message: "Password does not meet the requirements",
      path: ["newPassword"],
    },
  );

export type ChangePasswordFieldErrors = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};
