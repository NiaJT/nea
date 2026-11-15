import type {
  IProject,
  IProjectOrganization,
  IProjectPackage,
  PackageStatus,
  ProjectStatus,
} from "./project.type";

export type DocumentStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "COMMENTS_ISSUED"
  | "RESUBMISSION_REQUIRED"
  | "REVIEW_COMPLETED"
  | "RECOMMENDED"
  | "RECOMMENDED_APPROVAL"
  | "RECOMMENDED_REJECTION"
  | "RECOMMENDED_RESUBMISSION"
  | "APPROVED"
  | "REJECTED"
  | "SUPERSEDED"
  | "ARCHIVED"
  | "CANCELLED";

export type DocumentFileRole = "MAIN" | "SUPPORTING";

export interface IDocumentType {
  id: number;
  name: string;
  code: string;
  status: string;
}

export interface IOrganizationRef {
  name?: string;
  id: number;
  orgName: string;
  orgType: string;
  orgCode: string;
  contactPerson: string;
  contact: string;
  contactEmail: string;
  address: string;
  status: string;
}

export interface IRegionRef {
  id: number;
  name: string;
}

export interface IPackageRef {
  id: number;
  name: string;
  code: string;
  startDate: string;
  approxCompletionDate: string;
  completionDate: string | null;
  status: string;
  description: string;
  remarks: string;
  userIds: number[];
  contractor?: IOrganizationRef;
}

export interface IProjectRef {
  id: number;
  name: string;
  code: string;
  status: string;
  startDate: string;
  approxCompletionDate: string;
  completionDate: string | null;
  description: string;
  remarks: string;
  consultant?: IOrganizationRef;
  userIds: number[];
  packages?: IPackageRef[];
  region?: IRegionRef;
}

export interface IUserRef {
  id: number;
  fullName: string;
  email: string | null;
  username: string | null;
  phoneNumber: string | null;
  organizationId: number | null;
  organizationName: string | null;
  roleId: number;
  roleName: string;
  userStatus: string;
  lastLogin: string;
  assignedPackages: { id: number; name: string }[];
  assignedProjects: { id: number; name: string }[];
  packageCount: number;
  projectCount: number;
}

export interface IDocumentFile {
  id: number;
  originalFilename: string;
  fileRole: DocumentFileRole;
  contentType: string;
  sizeBytes: number;
}

/* -------------------------------------------------------------------------- */
/*  Document — list item                                                      */
/* -------------------------------------------------------------------------- */

export interface IDocumentListItem {
  id: number;
  documentTrackingId: string;
  title: string;
  projectName: string;
  packageName: string;
  documentTypeName: string;
  contractorName: string;
  submissionDate: string;
  revisionNumber: number;
  status: DocumentStatus;
}

/* -------------------------------------------------------------------------- */
/*  Document — detail                                                         */
/* -------------------------------------------------------------------------- */

export interface IDocumentCategoryRef {
  id: number;
  name: string;
}

export interface IDocumentRecommendationFile {
  id: number;
  originalFilename: string;
  contentType: string;
  sizeBytes: number;
  fileRole?: string;
}

export interface IDocumentRecommendation {
  id: number;
  revisionId: number;
  reviewId: number;
  roundNumber: number;
  outcome:
    | "RECOMMENDED_APPROVAL"
    | "RECOMMENDED_REJECTION"
    | "RECOMMENDED_RESUBMISSION";
  revisionStatus: string;
  rationale: string;
  files: IDocumentRecommendationFile[];
  recommendedBy: {
    id: number;
    fullName: string;
  };
}
export interface IDecision {
  id?: number;
  revisionId?: number;
  recommendationId?: number;
  roundNumber?: number;
  outcome?: string;
  revisionStatus?: string;
  rationale?: string | null;
  files?: IDocumentRevisionFile[];
  decidedBy?: IUserRef | null;
  decidedAt?: string | null;
}
export interface IDocumentReviewHistoryItem {
  revisionId: number;
  revisionNumber: number;
  roundStatus: "COMPLETED" | "PENDING" | "IN_PROGRESS" | string;
  completedAt: string | null;
  review: {
    id: number;
    roundNumber: number;
    reviewDate: string;
    reviewerId: number;
    reviewerName: string;
    commentCount: number;
    fileCount: number;
    comments: IReviewComment[];
    files: IDocumentRevisionFile[];
    recommendation: IDocumentRecommendation | null;
    contractorResponseFiles: File[];
  };
}
export interface IDocument {
  documentId: number;
  id?: number;
  documentTrackingId: string;
  title: string;
  documentType: IDocumentType;
  categoryId?: number;
  category?: IDocumentCategoryRef | null; // add this
  project: IProjectRef;
  projectPackage: IPackageRef;
  contractor: IOrganizationRef | null;
  consultant: IOrganizationRef | null;
  submissionDate: string;
  revisionNumber: number;
  description: string;
  reviewer: IUserRef | null;
  status: DocumentStatus;
  packageCode: string;
  preparedBy: IUserRef;
  approvalDate: string | null;
  remarks: string | null;
  files: IDocumentFile[];
  revision?: IDocumentRevision;
  recommendation?: IDocumentRecommendation | null;
  decision?: IDecision | null;
  contractorResponse?: IContractorResponse | null;
}
export interface CreateDocumentPayload {
  document: {
    title: string;
    documentTypeId: number;
    projectId: number;
    packageId: number;
    contractorId: number;
    consultantId: number;
    submissionDate: string; // "YYYY-MM-DD"
    preparedBy: string; // full name
    description?: string;
    categoryId: number;
    reviewerId: number | null;
  };
  mainFile: File;
  supportingFiles: File[];
}
export interface IDocumentListItem {
  id: number; // ← the flat ID
  documentTrackingId: string;
  title: string;
  projectName: string;
  packageName: string;
  documentTypeName: string;
  contractorName: string;
  submissionDate: string;
  revisionNumber: number;
  status: DocumentStatus;
}

export interface IDocumentRevisionFile {
  id: number;
  revisionId: number;
  originalFilename: string;
  contentType?: string;
  sizeBytes?: number;
  fileRole?: string;
  /** "REVISION" | "REVIEW" | "RECOMMENDATION" | "CONTRACTOR_RESPONSE" | "DECISION" | ... */
  source?: string;
  sourceId?: number;
  roundNumber?: number | null;
}

export interface IDocumentRevisionListItem {
  id?: number;
  revisionId?: number;
  documentId?: number;
  documentTrackingId?: string;
  revisionNumber: number;
  submissionDate: string;
  submittedById: number;
  submittedBy: string;
  status: DocumentStatus;
  remarks: string | null;
  files: IDocumentRevisionFile[];
}

export interface IDocumentRevision {
  id: number;
  approvalDate: string | null;
  reviewers: IUserRef[] | null;
  revisionNumber: number;
  revisionRemarks: string | null;
  submissionDate: string | null;
  status: DocumentStatus;
  submittedBy: IUserRef;
  preparedBy: IUserRef;
  approvedBy: IUserRef | null;
  files: IDocumentRevisionFile[];
}

export interface IDocumentActivity {
  id: number;
  action: string;
  actorRole: string;
  createdAt: string;
}

/* -------------------------------------------------------------------------- */
/*  Stats                                                                     */
/* -------------------------------------------------------------------------- */

export interface IDocumentListingStats {
  documents: number;
  underReview: number;
  approved: number;
  resubmissionRequired: number;
}

/* -------------------------------------------------------------------------- */
/*  Query params                                                              */
/* -------------------------------------------------------------------------- */

export interface IDocumentListParams {
  page?: number;
  per_page?: number;
  search?: string;
  projectId?: number;
  packageId?: number;
  documentTypeId?: number;
  contractorId?: number;
  status?: DocumentStatus;
  submittedFrom?: string; // yyyy-MM-dd
  submittedTo?: string; // yyyy-MM-dd
  revision?: number;
}

export interface IActivityListParams {
  page?: number;
  per_page?: number;
}

/* -------------------------------------------------------------------------- */
/*  Payloads                                                                  */
/* -------------------------------------------------------------------------- */

export interface IDocumentPayload {
  title: string;
  documentTypeId: number;
  projectId: number;
  packageId: number;
  contractorId: number;
  consultantId: number;
  submissionDate?: string;
  revisionNumber?: number;
  preparedBy?: string;
  description?: string;
  categoryId?: number | null;
  reviewerId?: number | null;
}

export interface IDocumentUpdatePayload {
  title: string;
  documentTypeId: number;
  description?: string;
  categoryId: number;
}

export interface IContractorResponseItem {
  reviewCommentId: number;
  responseText: string;
}

export interface IContractorResponsePayload {
  responses: IContractorResponseItem[];
}

export interface ICreateContractorResponseInput {
  reviewId: number;
  payload: IContractorResponsePayload;
  files?: File[];
}
export interface IReviewFile {
  id: number;
  originalFilename: string;
  source?: string;
  contentType?: string;
  sizeBytes?: number;
}

export interface IDocumentReview {
  id: number;
  roundNumber: number;
  reviewDate: string;
  reviewerId: number;
  reviewerName: string;
  commentCount: number;
  fileCount: number;
  comments: IReviewComment[];
  files: IReviewFile[];
}

export interface IContractorResponse {
  id?: number;
  reviewCommentId: number;
  responseText: string;
  respondedBy?: number | null;
  respondedAt?: string | null;
}

export interface IReviewComment {
  id: number;
  sequenceNumber?: number;
  finding: string;
  observation: string;
  contractorResponse?: IContractorResponse | null;
}

export interface IReviewFile {
  id: number;
  source?: string;
  sourceId?: number;
  revisionId?: number;
  roundNumber?: number | null;
  originalFilename: string;
  contentType?: string;
  sizeBytes?: number;
  fileRole?: string | null;
}

export interface IDocumentRevisionPayload {
  remarks?: string;
  revisionRemarks: string;
}

export interface IDocumentReviewPayload {
  status: Extract<DocumentStatus, "APPROVED" | "RESUBMISSION_REQUIRED">;
  remarks: string;
}

/* -------------------------------------------------------------------------- */
/*  Multipart input wrappers                                                  */
/* -------------------------------------------------------------------------- */

export interface ICreateDocumentInput {
  document: IDocumentPayload;
  mainFile: File;
  supportingFiles?: File[];
}

export interface ICreateRevisionInput {
  documentId: number;
  document: IDocumentRevisionPayload;
  mainFile: File;
}

/* -------------------------------------------------------------------------- */
/*  Document types endpoint                                                   */
/* -------------------------------------------------------------------------- */

export interface IDocumentTypeOption {
  id: number;
  name: string;
  code: string;
  status: DocumentTypeStatus;
}

export interface IDocumentProject extends IProject {
  projectPackage: IProjectPackage;
  consultant: IProjectOrganization | null;
  packages?: IProjectPackage[];
  status: ProjectStatus;
}

export interface IProjectWithPackages extends Omit<IProject, "packages"> {
  packages: IDocumentProjectPackage[];
}

export interface IPackageContractor {
  id: number;
  name: string;
  orgType: string;
  orgCode: string;
  contactPerson: string;
  contact: string;
  contactEmail: string;
  address: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  version?: number;
}

export interface IDocumentProjectPackage {
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
  contractor?: IPackageContractor | null;
}

export type RevisionStatus =
  | "Current"
  | "DRAFT"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "RESUBMISSION_REQUIRED"
  | "Superseded";

export interface DocumentRevision {
  id: number;
  revision: string;
  submitted: string;
  submittedBy: string;
  status: RevisionStatus;
  remarks: string;
}

export interface DocumentActivity {
  id: number;
  title: string;
  meta: string;
}

export const DOCUMENT_TYPE_STATUSES = ["ACTIVE", "INACTIVE"] as const;

export type DocumentTypeStatus = (typeof DOCUMENT_TYPE_STATUSES)[number];

export const DOCUMENT_TYPE_STATUS_LABELS: Record<DocumentTypeStatus, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
};

export const DOCUMENT_TYPE_STATUS_STYLES: Record<DocumentTypeStatus, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  INACTIVE: "bg-[#FCE9E9] text-[#AA3B42]",
};

export const DOCUMENT_TYPE_STATUS_OPTIONS = DOCUMENT_TYPE_STATUSES.map((v) => ({
  value: v,
  label: DOCUMENT_TYPE_STATUS_LABELS[v],
}));

export interface IDocumentTypeCreatePayload {
  name: string;
  code: string;
  status: DocumentTypeStatus;
}

export type IDocumentTypeUpdatePayload = Partial<IDocumentTypeCreatePayload>;

export type DocumentTrackingTab =
  | "all"
  | "myWork"
  | "awaitingReview"
  | "awaitingContractorResponse"
  | "awaitingRecommendation"
  | "awaitingDecision"
  | "overdue"
  | "completed";

export interface IDocumentTrackingItem {
  id: number;
  documentTrackingId: string | null;
  title: string;
  projectName?: string | null;
  packageName: string | null;
  packageCode: string | null;
  documentTypeName: string | null;
  contractorName: string | null;
  submissionDate: string;
  revisionNumber: number;

  dueDate: string | null;
  overDue: boolean | null;
  slaState: string | null;
  status: DocumentStatus;
  reviewers: IUserRef[] | null;
}

export interface IDocumentTrackingParams {
  tab?: DocumentTrackingTab;
  page?: number;
  per_page?: number;
  search?: string;
  projectId?: number;
  packageId?: number;
  status?: DocumentStatus;
  contractorId?: number;
  reviewerId?: number;
  submittedFrom?: string; // yyyy-MM-dd
  revision?: number;
  overdueOnly?: boolean;
}
export interface IDocumentReviewResponse {
  id: number;
  roundNumber: number;
  reviewDate: string;
  commentCount: number;
  fileCount: number;
}

export interface IDocumentTrackingRecord {
  id: number;
  title: string;
  documentTrackingId: string;
  documentNumber: string;
  trackingId: string;
  type: string;
  package: string;
  project: string;
  contractor: string;
  submissionDate: string;
  receivedDate: string;
  revision: string;
  reviewer: string;
  reviewDueDate: string;
  reviewDate: string;
  recommendation: string;
  recommendationRationale: string;
  approvalStatus: string;
  approvalDate: string;
  decisionMaker: string;
  contractorResponse: string;
  resubmissionDate: string;
  currentStatus: string;
  remarks: string;
  overdue: boolean;
}
