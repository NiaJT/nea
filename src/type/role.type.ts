export interface IPermission {
  id: number;
  name: string;
  code: string;
  description: string | null;
}

export interface IRole {
  id: number;
  name: string;
  description: string;
  organizationId: number;
  organizationName: string;
  permissions: IPermission[];
  users?: number;
  modulesConfigured?: number;
}

export interface IPermissionModule {
  id: number;
  name: string;
  code: string;
  description: string | null;
  permissions: IPermission[];
}

export interface IRoleListParams {
  page?: number;
  perPage?: number;
  name?: string;
  organizationId?: number;
}

export interface IRolePayload {
  name: string;
  description: string;
  organizationId: number;
}

export interface IRoleUpdatePayload {
  name?: string;
  description?: string;
  organizationId?: number;
}

export interface IUpdateRolePermissionsPayload {
  permissionIds: number[];
}

export interface IOrganizationRoleGroup {
  organizationId: number;
  organizationName: string;
  roles: IRole[];
}
