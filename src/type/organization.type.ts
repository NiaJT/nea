import type { IRole } from "./role.type";

export interface IOrganizationRoleGroup {
  organizationId: string;
  organization: string;
  roles: IRole[];
}
export type OrgType = "NEA" | "CONSULTANT" | "CONTRACTOR";
export type OrgStatus = "ACTIVE" | "INACTIVE";

export interface IOrganization {
  id: number;
  orgName: string;
  orgType: OrgType;
  orgCode: string;
  contactPerson: string;
  contact: string;
  contactEmail: string;
  address: string;
  status: OrgStatus;
}

export interface IPagination {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface IPaginatedResponse<T> {
  data: T[];
  message: string;
  pagination: IPagination;
  path: string;
  status: number;
  success: boolean;
  timestamp: string;
}

export interface IOrgListParams {
  page?: number;
  perPage?: number;
  organizationType?: string;
  status?: string;
}

export interface IOrganizationPayload {
  name: string;
  orgType: OrgType;
  orgCode: string;
  contactPerson: string;
  contact: string;
  contactEmail: string;
  address: string;
  status: OrgStatus;
}

// PATCH accepts partial bodies
export type IOrganizationUpdatePayload = Partial<IOrganizationPayload>;
