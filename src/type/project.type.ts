export const PROJECT_STATUSES = [
  "PENDING",
  "PLANNED",
  "ACTIVE",
  "INACTIVE",
  "HOLD",
  "COMPLETED",
] as const;

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  PENDING: "Pending",
  PLANNED: "Planned",
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  HOLD: "On Hold",
  COMPLETED: "Completed",
};

export const PROJECT_STATUS_OPTIONS = PROJECT_STATUSES.map((s) => ({
  label: PROJECT_STATUS_LABELS[s],
  value: s,
}));

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const PROJECT_STATUS_STYLES: Record<ProjectStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  PLANNED: "bg-blue-100 text-blue-800",
  ACTIVE: "bg-green-100 text-green-800",
  INACTIVE: "bg-[#FCE9E9] text-[#AA3B42]",
  HOLD: "bg-orange-100 text-orange-800",
  COMPLETED: "bg-emerald-100 text-emerald-800",
};

export const PACKAGE_STATUSES = [
  "PENDING",
  "PLANNED",
  "ACTIVE",
  "INACTIVE",
  "HOLD",
  "COMPLETED",
] as const;

export type PackageStatus = (typeof PACKAGE_STATUSES)[number];

export const PACKAGE_STATUS_LABELS: Record<PackageStatus, string> = {
  PENDING: "Pending",
  PLANNED: "Planned",
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  HOLD: "On Hold",
  COMPLETED: "Completed",
};

export const PACKAGE_STATUS_OPTIONS = PACKAGE_STATUSES.map((s) => ({
  label: PACKAGE_STATUS_LABELS[s],
  value: s,
}));

export const PACKAGE_STATUS_STYLES: Record<PackageStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  PLANNED: "bg-blue-100 text-blue-800",
  ACTIVE: "bg-green-100 text-green-800",
  INACTIVE: "bg-[#FCE9E9] text-[#AA3B42]",
  HOLD: "bg-orange-100 text-orange-800",
  COMPLETED: "bg-emerald-100 text-emerald-800",
};

export interface IProjectOrganization {
  id: number;
  orgName: string;
  orgType: string;
  orgCode: string;
  contactPerson: string;
  contact: string;
  contactEmail: string;
  address: string;
  status: string;
  userCount?: number;
}

export interface IProjectPackage {
  id: number;
  name: string;
  code: string;
  startDate: string | null;
  approxCompletionDate: string | null;
  completionDate: string | null;
  status: ProjectStatus;
  description: string;
  remarks: string;
  userIds: number[];
}

export interface IProjectRegion {
  id: number;
  name: string;
}

export interface IProject {
  id: number;
  name: string;
  code: string;
  status: ProjectStatus;
  startDate: string | null;
  approxCompletionDate: string | null;
  completionDate: string | null;
  description: string | null;
  remarks: string | null;
  consultant: IProjectOrganization | null;

  region: IProjectRegion | null;
  userIds?: number[];

  projectId?: string;
  client?: string;
  plannedCompletion?: string;
  projectCount?: number;
  packages?: IProjectPackage[];

  extendedCompletionDate?: string | null;
}

export interface IProjectRow extends IProject {
  rowKey: string;
  /** the single package shown in this row, or null if the project has none */
  rowPackage: IProjectPackage | null;
}

export interface IProjectDetail extends IProject {
  packages: IProjectPackage[];
}

export interface IProjectListParams {
  page: number;
  perPage: number;
  search?: string;
  status?: string;
  consultantId?: number;
}

export interface IProjectCreatePayload {
  name: string;
  code: string;
  status: ProjectStatus;
  regionId: number;
  consultantId: number;
  startDate: string | null;
  approxCompletionDate: string | null;
  completionDate: string | null;
  description: string | null;
  remarks: string | null;
  userIds?: number[];
  extendedCompletionDate?: string | null;
}

export type IProjectUpdatePayload = Partial<IProjectCreatePayload>;

export interface IProjectDetail extends IProject {
  packages: IProjectPackage[];
}

export interface IPackageType {
  id: number;
  name: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface IProjectPackage {
  id: number;
  name: string;
  code: string;
  startDate: string | null;
  approxCompletionDate: string | null;
  completionDate: string | null;
  status: PackageStatus;
  description: string;
  remarks: string;
  userIds: number[];
  // returned by GET /project-package/:id (assumed)
  project?: {
    id: number;
    name: string;
    code: string;
    consultant?: IProjectOrganization | null;
    region?: IProjectRegion | null;
  } | null;
  packageType?: IPackageType | null;
  contractor?: {
    id?: number;
    name?: string;
  };
  // contractors?: IProjectOrganization[];
  consultant?: IProjectOrganization | null;
  region?: IProjectRegion | null;
}

export interface IPackageCreatePayload {
  name: string;
  code: string;
  status: PackageStatus;
  startDate: string | null;
  approxCompletionDate: string | null;
  description: string | null;
  remarks: string | null;
  projectId: number;
  packageTypeId: number;
  contractorId: number;
  consultantId: number;
  regionId: number;
  userIds?: number[];
}

export type IPackageUpdatePayload = Partial<IPackageCreatePayload>;

// table row
export interface IPackage {
  id: number;
  projectId: string;
  number: string;
  name: string;
  type: string;
  contractor: string;
  consultant: string;
  region: string;
  startDate: string;
  completion: string;
  status: PackageStatus;
  description?: string | null;
  remarks?: string | null;
}

export interface IProjectStatistics {
  totalProjects: number;
  activePackages: number;
  completedPackages: number;
  totalPackages: number;
}
