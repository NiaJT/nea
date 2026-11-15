export const PACKAGE_TYPE_STATUSES = ["ACTIVE", "INACTIVE"] as const;

export type PackageTypeStatus = (typeof PACKAGE_TYPE_STATUSES)[number];

export const PACKAGE_TYPE_STATUS_LABELS: Record<PackageTypeStatus, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
};

export const PACKAGE_TYPE_OPTIONS = PACKAGE_TYPE_STATUSES.map((v) => ({
  value: v,
  label: PACKAGE_TYPE_STATUS_LABELS[v],
}));

export const PROJECT_STATUS_STYLES: Record<PackageTypeStatus, string> = {
  ACTIVE: "bg-green-100 text-green-800",
  INACTIVE: "bg-[#FCE9E9] text-[#AA3B42]",
};

export interface IPackageType {
  id: number;
  name: string;
  status: PackageTypeStatus;
}
export interface IPackageTypeCreatePayload {
  name: string;
  status: PackageTypeStatus;
}

export type IPackageTypeUpdatePayload = Partial<IPackageTypeCreatePayload>;

export interface IPackageStatusUpdatePayload {
  status: "ACTIVE" | "INACTIVE";
}
