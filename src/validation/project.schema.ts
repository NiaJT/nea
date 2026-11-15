import { PACKAGE_STATUSES, PROJECT_STATUSES } from "@/type/project.type";
import { z } from "zod";

export const projectSchema = z
  .object({
    name: z.string().trim().min(1, "Project name is required"),
    code: z.string().trim().min(1, "Project code is required"),
    consultant: z.string().min(1, "Consultant is required"),
    startDate: z.string().min(1, "Start date is required"),
    plannedCompletion: z.string().min(1, "Planned completion date is required"),
    actualCompletion: z.string().optional(),
    regionId: z.string().min(1, "Region is required"),
    status: z.enum(PROJECT_STATUSES, { message: "Status is required" }),
    description: z.string().optional(),
    remarks: z.string().optional(),
  })
  .superRefine((v, ctx) => {
    if (
      v.startDate &&
      v.plannedCompletion &&
      v.plannedCompletion < v.startDate
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["plannedCompletion"],
        message: "Planned completion cannot precede the start date",
      });
    }
  });

export type ProjectFormValues = z.input<typeof projectSchema>;
export type ProjectSubmitValues = z.output<typeof projectSchema>;

export const packageSchema = z
  .object({
    parentProject: z.string().min(1, "Parent project is required"),
    number: z.string().trim().min(1, "Package number is required"),
    name: z.string().trim().min(1, "Package name is required"),
    status: z.enum(PACKAGE_STATUSES, { message: "Status is required" }),
    startDate: z.string().min(1, "Start date is required"),
    completionDate: z.string().min(1, "Completion date is required"),
    description: z.string().optional(),
    remarks: z.string().optional(),
    type: z.string().min(1, "Package type is required"),
    // contractors: z.array(z.string()).min(1, "Select at least one contractor"),
    contractor: z.coerce
      .number({ error: "Contractor is required" })
      .min(1, "Contractor is required"),
    consultant: z.string().min(1, "Consultant is required"),
    region: z.string().min(1, "Region is required"),
  })
  .superRefine((v, ctx) => {
    if (v.startDate && v.completionDate && v.completionDate < v.startDate) {
      ctx.addIssue({
        code: "custom",
        path: ["completionDate"],
        message: "Completion cannot precede the start date",
      });
    }
  });

export type PackageFormValues = z.input<typeof packageSchema>;
export type PackageSubmitValues = z.output<typeof packageSchema>;

export const EMPTY_PACKAGE_VALUES: PackageFormValues = {
  parentProject: "",
  number: "",
  name: "",
  type: "",
  contractor: "",
  consultant: "",
  region: "",
  status: "" as PackageFormValues["status"],
  startDate: "",
  completionDate: "",
  description: "",
  remarks: "",
};
