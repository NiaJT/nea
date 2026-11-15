import { PACKAGE_TYPE_STATUSES } from "@/type/packageType.type";
import z from "zod";

export const packageTypeSchema = z.object({
  name: z.string().trim().min(1, "Package Type name is required"),
  status: z.enum(PACKAGE_TYPE_STATUSES, { message: "Status is required" }),
});

export type PackageTypeFormValues = z.input<typeof packageTypeSchema>;
export type PackageTypeSubmitValues = z.output<typeof packageTypeSchema>;
