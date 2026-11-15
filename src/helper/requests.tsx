import { api } from "@/api";
import type {
  ILoginPayload,
  ILoginResponseData,
  IApiResponse,
  IApiMessageResponse,
  IChangePasswordPayload,
  IForgotPasswordPayload,
  IResetPasswordPayload,
} from "@/type/auth.type";
import type {
  IDashboardDocuments,
  IDashboardProjectsPackages,
} from "@/type/dashboard.type";
import type {
  IDocument,
  IDocumentActivity,
  IDocumentListParams,
  IDocumentListingStats,
  IDocumentTypeOption,
  IDocumentUpdatePayload,
  IActivityListParams,
  ICreateDocumentInput,
  ICreateRevisionInput,
  IDocumentListItem,
  IDocumentRevisionListItem,
  IDocumentTypeCreatePayload,
  IDocumentTypeUpdatePayload,
  IDocumentTrackingItem,
  IDocumentTrackingParams,
  DocumentTrackingTab,
  IDocumentReviewResponse,
  IDocumentReview,
  ICreateContractorResponseInput,
  IDocumentReviewHistoryItem,
} from "@/type/document.type";
import type {
  IOrganization,
  IOrganizationPayload,
  IOrganizationUpdatePayload,
  IOrgListParams,
  IPaginatedResponse,
} from "@/type/organization.type";
import type {
  IDocumentCategory,
  IDocumentCategoryCreatePayload,
  IDocumentCategoryUpdatePayload,
} from "@/type/packageCategory.type";
import type {
  IPackageStatusUpdatePayload,
  IPackageType,
  IPackageTypeCreatePayload,
  IPackageTypeUpdatePayload,
} from "@/type/packageType.type";
import type {
  IPackageCreatePayload,
  IPackageUpdatePayload,
  IProject,
  IProjectCreatePayload,
  IProjectDetail,
  IProjectListParams,
  IProjectPackage,
  IProjectStatistics,
  IProjectUpdatePayload,
} from "@/type/project.type";
import type { IRegionListResponse } from "@/type/region.type";
import type {
  IPermissionModule,
  IRole,
  IRoleListParams,
  IRolePayload,
  IRoleUpdatePayload,
  IUpdateRolePermissionsPayload,
} from "@/type/role.type";
import type {
  IUser,
  IUserCreatePayload,
  IUserListParams,
  IUserUpdatePayload,
} from "@/type/user.type";
import {
  AUTH_PATHS,
  DASHBOARD_PATHS,
  DOCUMENT_CATEGORY_PATHS,
  DOCUMENT_PATHS,
  DOCUMENT_TYPE_PATHS,
  ORG_PATHS,
  PACKAGE_PATHS,
  PACKAGE_TYPE_PATHS,
  PERMISSION_PATHS,
  PROJECT_PATHS,
  REGION_PATHS,
  ROLE_PATHS,
  USER_PATHS,
} from "@/utils/paths";

const auth = {
  login: (data: ILoginPayload) =>
    api.post<IApiResponse<ILoginResponseData>>(AUTH_PATHS.login, data),
  refresh: () => api.post<IApiMessageResponse>(AUTH_PATHS.refresh),
  me: () => api.get<IApiResponse<ILoginResponseData>>(AUTH_PATHS.me),
  logout: () => api.post<IApiMessageResponse>(AUTH_PATHS.logout),
  changePassword: (data: IChangePasswordPayload) =>
    api.post<IApiMessageResponse>(AUTH_PATHS.changePassword, data),
  forgotPassword: (data: IForgotPasswordPayload) =>
    api.post<IApiMessageResponse>(AUTH_PATHS.forgotPassword, data),
  resetPassword: (data: IResetPasswordPayload) =>
    api.post<IApiMessageResponse>(AUTH_PATHS.resetPassword, data),
};

const org = {
  getOrganization: (params?: IOrgListParams) =>
    api.get<IPaginatedResponse<IOrganization>>(ORG_PATHS.base, { params }),
  getOrganizationById: (id: number) =>
    api.get<IApiResponse<IOrganization>>(ORG_PATHS.byId(id)),
  createOrganization: (data: IOrganizationPayload) =>
    api.post<IApiResponse<IOrganization>>(ORG_PATHS.create, data),
  updateOrganization: (id: number, data: IOrganizationUpdatePayload) =>
    api.patch<IApiResponse<IOrganization>>(ORG_PATHS.byId(id), data),
  deleteOrganization: (id: number) =>
    api.delete<IApiMessageResponse>(ORG_PATHS.byId(id)),
  toggleOrganizationStatus: (id: number) =>
    api.patch<IApiResponse<IOrganization>>(ORG_PATHS.toggleStatus(id)),
};

const user = {
  getUsers: (params?: IUserListParams) =>
    api.get<IPaginatedResponse<IUser>>(USER_PATHS.base, { params }),
  getUserById: (id: number) =>
    api.get<IApiResponse<IUser>>(USER_PATHS.byId(id)),
  createUser: (data: IUserCreatePayload) =>
    api.post<IApiResponse<IUser>>(USER_PATHS.base, data),
  updateUser: (id: number, data: IUserUpdatePayload) =>
    api.patch<IApiResponse<IUser>>(USER_PATHS.byId(id), data),
  deleteUser: (id: number) =>
    api.delete<IApiMessageResponse>(USER_PATHS.delete(id)),
  toggleUserStatus: (id: number) =>
    api.patch<IApiResponse<IUser>>(USER_PATHS.toggleStatus(id)),
};

const role = {
  getRoles: (params?: IRoleListParams) =>
    api.get<IPaginatedResponse<IRole>>(ROLE_PATHS.base, { params }),
  getRoleById: (id: number) =>
    api.get<IApiResponse<IRole>>(ROLE_PATHS.byId(id)),
  createRole: (data: IRolePayload) =>
    api.post<IApiResponse<IRole>>(ROLE_PATHS.create, data),
  updateRole: (id: number, data: IRoleUpdatePayload) =>
    api.patch<IApiResponse<IRole>>(ROLE_PATHS.byId(id), data),
  deleteRole: (id: number) =>
    api.delete<IApiMessageResponse>(ROLE_PATHS.byId(id)),
  updateRolePermissions: (id: number, data: IUpdateRolePermissionsPayload) =>
    api.patch<IApiResponse<IRole>>(ROLE_PATHS.updatePermissions(id), data),
};

const permission = {
  getModules: () =>
    api.get<IApiResponse<IPermissionModule[]>>(PERMISSION_PATHS.modules),
};

const region = {
  getRegions: () => api.get<IRegionListResponse>(REGION_PATHS.base),
};

const project = {
  getProjects: (params?: IProjectListParams) =>
    api.get<IPaginatedResponse<IProject>>(PROJECT_PATHS.base, { params }),

  getProjectById: (id: number) =>
    api.get<IApiResponse<IProjectDetail>>(PROJECT_PATHS.byId(id)),

  createProject: (data: IProjectCreatePayload) =>
    api.post<IApiResponse<IProject>>(PROJECT_PATHS.base, data),

  updateProject: (id: number, data: IProjectUpdatePayload) =>
    api.patch<IApiResponse<IProject>>(PROJECT_PATHS.byId(id), data),

  deleteProject: (id: number) =>
    api.delete<IApiMessageResponse>(PROJECT_PATHS.byId(id)),

  getProjectStatistics: () =>
    api.get<IApiResponse<IProjectStatistics>>(PROJECT_PATHS.statistics),

  toggleProjectStatus: (id: number) =>
    api.patch<IApiResponse<IProject>>(PROJECT_PATHS.toggleStatus(id)),
};

const document = {
  getDocuments: (params?: IDocumentListParams) =>
    api.get<IPaginatedResponse<IDocumentListItem>>(DOCUMENT_PATHS.base, {
      params,
    }),

  getDocumentById: (id: number) =>
    api.get<IApiResponse<IDocument>>(DOCUMENT_PATHS.byId(id)),

  createDocument: (input: ICreateDocumentInput) => {
    const form = new FormData();

    form.append(
      "document",
      new Blob([JSON.stringify(input.document)], { type: "application/json" }),
    );

    form.append("mainFile", input.mainFile);

    input.supportingFiles?.forEach((file) => {
      form.append("supportingFiles", file);
    });

    return api.post<IApiResponse<IDocument>>(DOCUMENT_PATHS.create, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  createRevision: (input: ICreateRevisionInput) => {
    const form = new FormData();

    form.append(
      "document",
      new Blob([JSON.stringify(input.document)], { type: "application/json" }),
    );

    form.append("mainFile", input.mainFile);

    return api.post<IApiResponse<IDocument>>(
      DOCUMENT_PATHS.revisions(input.documentId),
      form,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
  },
  getRevisions: (id: number) =>
    api.get<IApiResponse<IDocumentRevisionListItem[]>>(
      DOCUMENT_PATHS.revisions(id),
    ),

  // inside requests.document
  createReview: (
    revisionId: number,
    payload: { comments: { finding: string; observation: string }[] },
    supportingFiles: File[],
  ) => {
    const form = new FormData();
    form.append(
      "review",
      new Blob([JSON.stringify(payload)], { type: "application/json" }),
    );
    supportingFiles.forEach((file) => form.append("supportingFiles", file));

    return api.post<IApiResponse<IDocumentReviewResponse>>(
      `${DOCUMENT_PATHS.base.replace("/documents", "")}/document-reviews/${revisionId}/reviews`,
      form,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
  },

  createRecommendation: (
    revisionId: number,
    reviewId: number,
    payload: { outcome: string; rationale: string },
    supportingFiles: File[],
  ) => {
    const form = new FormData();
    form.append(
      "recommendation",
      new Blob([JSON.stringify(payload)], { type: "application/json" }),
    );
    supportingFiles.forEach((file) => form.append("supportingFiles", file));

    return api.post<IApiResponse<unknown>>(
      `${DOCUMENT_PATHS.base.replace("/documents", "")}/document-reviews/${revisionId}/reviews/${reviewId}/recommendation`,
      form,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
  },
  createDecision: (
    recommendationId: number | string,
    payload: { outcome: string; rationale: string; confirmed: boolean },
    supportingFiles: File[],
  ) => {
    const form = new FormData();

    // Backend expects the decision JSON blob explicitly under "decision"
    form.append(
      "decision",
      new Blob([JSON.stringify(payload)], { type: "application/json" }),
    );

    supportingFiles.forEach((file) => {
      form.append("supportingFiles", file);
    });

    return api.post<IApiResponse<unknown>>(
      `document-decisions/${recommendationId}/decisions`,
      form,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
  },

  getDocumentActivities: (id: number, params?: IActivityListParams) =>
    api.get<IPaginatedResponse<IDocumentActivity>>(
      DOCUMENT_PATHS.activities(id),
      { params },
    ),

  getListingStats: () =>
    api.get<IApiResponse<IDocumentListingStats>>(DOCUMENT_PATHS.listingStats),
  // In src/helper/requests.ts

  getDocumentFile: (
    documentId: number,
    fileId?: number,
    params?: { source?: string },
  ) =>
    api.get<Blob>(
      fileId
        ? `${DOCUMENT_PATHS.base}/${documentId}/files/${fileId}`
        : `${DOCUMENT_PATHS.base}/${documentId}/files`,
      {
        params,
        responseType: "blob",
      },
    ),
  downloadDocument: (documentId: number | string) => {
    return api.get(`${DOCUMENT_PATHS.base}/${documentId}/download`, {
      responseType: "blob",
    });
  },
  getReviewHistory: (documentId: number) =>
    api.get<IApiResponse<IDocumentReviewHistoryItem[]>>(
      `${DOCUMENT_PATHS.base}/${documentId}/review-history`,
    ),
  updateDocument: (id: number, data: IDocumentUpdatePayload) =>
    api.patch<IApiResponse<IDocument>>(DOCUMENT_PATHS.byId(id), data),
  getReviews: (revisionId: number) =>
    api.get<IApiResponse<IDocumentReview[]>>(
      `document-reviews/${revisionId}/reviews`,
    ),
  createContractorResponse: (input: ICreateContractorResponseInput) => {
    const form = new FormData();
    form.append(
      "response",
      new Blob([JSON.stringify(input.payload)], { type: "application/json" }),
    );
    input.files?.forEach((file) => form.append("files", file));
    return api.post<IApiResponse<unknown>>(
      `document-contractor-responses/${input.reviewId}/contractor-responses`,
      form,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
  },
  cancelDocument: (documentId: number | string, payload: { reason: string }) =>
    api.post<IApiResponse<unknown>>(
      `document-cancellations/${documentId}/cancel`,
      payload,
    ),
  registerDocumentSubmission: (
    documentId: number | string,
    payload: { remarks: string },
    evidenceFiles: File[],
  ) => {
    const form = new FormData();

    form.append(
      "document",
      new Blob([JSON.stringify(payload)], { type: "application/json" }),
    );

    evidenceFiles.forEach((file) => {
      form.append("evidenceFiles", file);
    });

    return api.post<IApiResponse<unknown>>(
      `${DOCUMENT_PATHS.base}/${documentId}/register`,
      form,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
  },
};
const TAB_TO_API: Record<DocumentTrackingTab, string> = {
  all: "ALL",
  myWork: "MY_WORK",
  awaitingReview: "AWAITING_REVIEW",
  awaitingContractorResponse: "AWAITING_CONTRACTOR_RESPONSE",
  awaitingRecommendation: "AWAITING_RECOMMENDATION",
  awaitingDecision: "AWAITING_DECISION",
  overdue: "OVERDUE",
  completed: "COMPLETED",
};

export const documentTracking = {
  getTracking: (params: IDocumentTrackingParams = {}) => {
    const query = new URLSearchParams();

    if (params.tab) query.append("tab", TAB_TO_API[params.tab]);
    if (params.page != null) query.append("page", String(params.page));
    if (params.per_page != null)
      query.append("per_page", String(params.per_page));
    if (params.search) query.append("search", params.search);
    if (params.projectId != null)
      query.append("projectId", String(params.projectId));
    if (params.packageId != null)
      query.append("packageId", String(params.packageId));
    if (params.status) query.append("status", params.status);
    if (params.contractorId != null)
      query.append("contractorId", String(params.contractorId));
    if (params.reviewerId != null)
      query.append("reviewerId", String(params.reviewerId));
    if (params.submittedFrom)
      query.append("submittedFrom", params.submittedFrom);
    if (params.revision != null)
      query.append("revision", String(params.revision));
    if (params.overdueOnly) query.append("overdueOnly", "true");
    const qs = query.toString();
    return api.get<IPaginatedResponse<IDocumentTrackingItem[]>>(
      `${DOCUMENT_PATHS.base}${qs ? `?${qs}` : ""}`,
    );
  },
};
const documentType = {
  getAll: () =>
    api.get<IApiResponse<IDocumentTypeOption[]>>(DOCUMENT_TYPE_PATHS.base),
  getById: (id: number) =>
    api.get<IApiResponse<IDocumentTypeOption>>(DOCUMENT_TYPE_PATHS.byId(id)),
  createDocType: (data: IDocumentTypeCreatePayload) =>
    api.post<IApiResponse<IDocumentTypeOption>>(DOCUMENT_TYPE_PATHS.base, data),
  updateDocumentType: (id: number, data: IDocumentTypeUpdatePayload) =>
    api.patch<IApiResponse<IDocumentTypeOption>>(
      `${DOCUMENT_TYPE_PATHS.base}/${id}`,
      data,
    ),
  deleteDocumentType: (id: number) =>
    api.delete<IApiResponse<null>>(`${DOCUMENT_TYPE_PATHS.base}/${id}`),
  toggleDocumentTypeStatus: (id: number) =>
    api.patch<IApiResponse<IDocumentTypeOption>>(
      `${DOCUMENT_TYPE_PATHS.base}/${id}/update-status`,
    ),
};

const packageType = {
  getPackageTypes: () =>
    api.get<IApiResponse<IPackageType[]>>(PACKAGE_TYPE_PATHS.base),
  getPackageTypeById: (id: number) =>
    api.get<IApiResponse<IPackageType>>(PACKAGE_TYPE_PATHS.byId(id)),
  createPackageType: (data: IPackageTypeCreatePayload) =>
    api.post<IApiResponse<IPackageType>>(PACKAGE_TYPE_PATHS.base, data),
  updatePackageType: (id: number, data: IPackageTypeUpdatePayload) =>
    api.patch<IApiResponse<IPackageType>>(
      `${PACKAGE_TYPE_PATHS.base}/${id}`,
      data,
    ),
  deletePackageType: (id: number) =>
    api.delete<IApiResponse<null>>(`${PACKAGE_TYPE_PATHS.base}/${id}`),

  updatePackageStatus: (packageId: number, data: IPackageStatusUpdatePayload) =>
    api.patch<IApiMessageResponse>(
      PACKAGE_TYPE_PATHS.packageStatus(packageId),
      data,
    ),

  togglePackageTypeStatus: (id: number) =>
    api.patch<IApiResponse<IPackageType>>(PACKAGE_TYPE_PATHS.toggleStatus(id)),
};

const projectPackage = {
  getPackage: (id: number) =>
    api.get<IApiResponse<IProjectPackage>>(`${PACKAGE_PATHS.base}/${id}`),
  createPackage: (data: IPackageCreatePayload) =>
    api.post<IApiResponse<IProjectPackage>>(PACKAGE_PATHS.base, data),
  updatePackage: (id: number, data: IPackageUpdatePayload) =>
    api.patch<IApiResponse<IProjectPackage>>(
      `${PACKAGE_PATHS.base}/${id}`,
      data,
    ),
  deletePackage: (id: number) =>
    api.delete<IApiResponse<null>>(`${PACKAGE_PATHS.base}/${id}`),
  toggleStatus: (id: number) =>
    api.patch<IApiResponse<IProjectPackage>>(
      `${PACKAGE_PATHS.base}/${id}/update-status`,
    ),
};

const documentCategory = {
  getAll: () =>
    api.get<IApiResponse<IDocumentCategory[]>>(DOCUMENT_CATEGORY_PATHS.base),
  getById: (id: number) =>
    api.get<IApiResponse<IDocumentCategory>>(DOCUMENT_CATEGORY_PATHS.byId(id)),
  createDocumentCategory: (data: IDocumentCategoryCreatePayload) =>
    api.post<IApiResponse<IDocumentCategory>>(
      DOCUMENT_CATEGORY_PATHS.base,
      data,
    ),
  updateDocumentCategory: (id: number, data: IDocumentCategoryUpdatePayload) =>
    api.patch<IApiResponse<IDocumentCategory>>(
      `${DOCUMENT_CATEGORY_PATHS.base}/${id}`,
      data,
    ),
  deleteDocumentCategory: (id: number) =>
    api.delete<IApiResponse<null>>(`${DOCUMENT_CATEGORY_PATHS.base}/${id}`),
  toggleDocumentCategoryStatus: (id: number) =>
    api.patch<IApiResponse<IDocumentCategory>>(
      `${DOCUMENT_CATEGORY_PATHS.base}/${id}/update-status`,
    ),
};

const dashboard = {
  getProjectsPackages: () =>
    api.get<IApiResponse<IDashboardProjectsPackages>>(
      DASHBOARD_PATHS.projectsPackages,
    ),
  getDocuments: () =>
    api.get<IApiResponse<IDashboardDocuments>>(DASHBOARD_PATHS.documents),
};

const requests = {
  auth,
  org,
  user,
  role,
  permission,
  region,
  project,
  document,
  packageType,
  projectPackage,
  documentType,
  documentCategory,
  documentTracking,
  dashboard,
};

export default requests;
