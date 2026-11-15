export const AUTH_PATHS = {
  login: "auth/login",
  refresh: "auth/refresh",
  changePassword: "auth/change-password",
  me: "auth/me",
  logout: "auth/logout",
  forgotPassword: "password-reset",
  resetPassword: "password-reset/reset",
} as const;

export const ORG_PATHS = {
  base: "/orgs",
  create: "/orgs/create",
  byId: (id: number) => `/orgs/${id}`,
  toggleStatus: (id: number) => `/orgs/${id}/toggle-status`,
};

export const USER_PATHS = {
  base: "/users",
  byId: (id: number) => `/users/${id}`,
  delete: (id: number) => `/users/delete/${id}`,
  toggleStatus: (id: number) => `/users/${id}/toggle-status`,
};
export const ROLE_PATHS = {
  base: "/roles",
  create: "/roles",
  byId: (id: number) => `/roles/${id}`,
  updatePermissions: (id: number) => `/roles/${id}/update-permissions`,
} as const;

export const PERMISSION_PATHS = {
  modules: "/permission-module",
} as const;

export const REGION_PATHS = {
  base: "/regions",
};

export const PROJECT_PATHS = {
  base: "/project",
  byId: (id: number) => `/project/${id}`,
  statistics: "/project/statistics",
  toggleStatus: (id: number) => `/project/${id}/toggle-status`,
} as const;

export const DOCUMENT_PATHS = {
  base: "/documents",
  create: "/documents",
  byId: (id: number) => `/documents/${id}`,
  revisions: (id: number) => `/documents/${id}/revisions`,
  assignReviewer: (id: number, reviewerId: number) =>
    `/documents/${id}/assign-reviewer/${reviewerId}`,
  reviewDocument: (id: number) => `/documents/${id}/review-document`,
  activities: (id: number) => `/documents/${id}/document-activites`,
  listingStats: "/documents/listing-stats",
  getFile: (documentId: number, fileId: number) =>
    `/documents/${documentId}/files/${fileId}`,
} as const;

export const PACKAGE_TYPE_PATHS = {
  base: "/package-type",
  byId: (id: number) => `/package-type/${id}`,
  toggleStatus: (id: number) => `/package-type/${id}/toggle-status`,
  packageStatus: (packageId: number) =>
    `/project-package/${packageId}/update-status`,
};

export const PACKAGE_PATHS = { base: "/project-package" };
export const DOCUMENT_TYPE_PATHS = {
  base: "/document-type",
  byId: (id: number) => `/document-type/${id}`,
  toggleStatus: (id: number) => `/document-type/${id}/update-status`,
} as const;

export const DOCUMENT_CATEGORY_PATHS = {
  base: "/document-category",
  byId: (id: number) => `/document-category/${id}`,
  toggleStatus: (id: number) => `/document-category/${id}/update-status`,
} as const;

export const DOCUMENT_TRACKING_PATHS = {
  base: "/documents/tracking",
  byTab: (tab: string) => `/documents/tracking/${tab}`,
  trackingById: (id: number) => `/documents/tracking/${id}`,
};
export const DASHBOARD_PATHS = {
  projectsPackages: "/dashboard/projects-packages",
  documents: "/dashboard/documents",
} as const;
