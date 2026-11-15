import type { OrgType } from "./organization.type";

export interface ILoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export type UserRole = "SYSTEM_ADMIN" | "ADMIN" | "USER" | string;

export interface IModulePermission {
  moduleName: string;
  permissions: string[];
}

export interface ILoginResponseData {
  id: number;
  fullName: string;
  email: string;
  roles: UserRole[];
  permissions: { moduleName: string; permissions: string[] }[];
  mustChangePassword: boolean;
  organization: { name: string; type: OrgType } | null;
}
export interface IApiResponse<T> {
  data: T;
  message: string;
  path: string;
  status: number;
  success: boolean;
  timestamp: string;
  errors?: string[];
}

export interface IApiMessageResponse {
  message: string;
  path: string;
  status: number;
  success: boolean;
  timestamp: string;
}

export interface IChangePasswordPayload {
  currentPassword: string;
  password: string;
  confirmPassword: string;
}

export interface IForgotPasswordPayload {
  email: string;
}

export interface IResetPasswordPayload {
  token: string;
  password: string;
  confirmPassword: string;
}
