import type { PackageTypeFormValues } from "@/validation/packageType.schema";

export const EMPTY_PACKAGE_TYPE_VALUES: PackageTypeFormValues = {
  name: "",
  status: "" as PackageTypeFormValues["status"],
};
