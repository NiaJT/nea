export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface IUserRef {
  id: number;
  name: string;
}
export interface IUser {
  id: number;
  fullName: string;
  username: string | null;
  email: string;
  phoneNumber: string | null;
  organizationId: number | null;
  organizationName: string | null;
  packageCount: number;
  roleId: number;
  roleName: string;
  userStatus: UserStatus;
  lastLogin: string | null;
  assignedProjects: IUserRef[] | null;
  assignedPackages: IUserRef[] | null;
}

export interface IUserListParams {
  page: number;
  perPage: number;
  search?: string;
  status?: string;
  organizationId?: number;
  roleId?: number;
}

export interface IUserCreatePayload {
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  organizationId: number;
  roleId: number;
  status: UserStatus;
  packageIds: number[];
}

export type IUserUpdatePayload = IUserCreatePayload;
