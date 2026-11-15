import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import PageBreadcrumb from "@/component/userPages/PageBreadcrumb";
import PageHeader from "@/component/userPages/PageHeader";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

import {
  OverviewSidebar,
  type WorkflowStep,
} from "@/component/document/revision/OverviewSidebar";
import {
  AttachmentsTab,
  type AttachmentFile,
} from "@/component/document/revision/AttachmentTab";
import DocumentMetadataCard from "@/component/document/DocumentMetaCard";
import DocumentRevisionHistory from "./DocumentRevisionHistory";
import { DocumentActivityTab } from "@/component/document/revision/ActivityTab";
import { EditDocumentMetadataDialog } from "@/component/document/form/EditDocumentMetaDataDialog";
import { useDocument, useDocumentRevisions } from "@/action/useDocuments";
import { useFileDownload } from "@/hooks/useFileDownload";
import { useFilePreview } from "@/hooks/useFilePreview";
import type { DocumentStatus } from "@/type/document.type";
import { DocumentActionButtons } from "@/component/document/renderer/DocumentActionButton";
import { useMe } from "@/action/useAuth";
import { CommentsAndResponsesTab } from "@/component/document/revision/CommentResponse";
import { ReviewRoundsTab } from "@/component/document/revision/ReviewRoundsTab";

const STATUS_LABELS: Record<DocumentStatus, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  COMMENTS_ISSUED: "Comments Issued",
  RESUBMISSION_REQUIRED: "Resubmission Required",
  REVIEW_COMPLETED: "Review Completed",
  RECOMMENDED: "Recommended",
  RECOMMENDED_APPROVAL: "Recommended Approval",
  RECOMMENDED_REJECTION: "Recommend Rejection",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  SUPERSEDED: "Superseded",
  ARCHIVED: "Archived",
  RECOMMENDED_RESUBMISSION: "Recommend Resubmission",
  CANCELLED: "Cancelled",
};

const TABS = [
  "Overview",
  "Attachments",
  "Review Rounds",
  "Comments & Responses",
  "Revision History",
  "Activity",
];

const SubmissionDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [commentsRevisionId, setCommentsRevisionId] = useState<
    number | undefined
  >();
  const { downloadFile, downloadingId } = useFileDownload();
  const { previewFile } = useFilePreview();

  const { data: response, isLoading, isError } = useDocument(Number(id));
  const { data: revisionsResponse, isLoading: revisionsLoading } =
    useDocumentRevisions(Number(id));
  const { data: me, isLoading: meLoading } = useMe();

  const doc = response?.data;
  const revisions = revisionsResponse?.data ?? [];

  const currentStatus = (doc?.revision?.status ?? doc?.status) as
    | DocumentStatus
    | undefined;

  const currentRevision = useMemo(() => {
    if (!revisions.length) return null;
    return [...revisions].sort(
      (a, b) => b.revisionNumber - a.revisionNumber,
    )[0];
  }, [revisions]);

  const attachmentFiles: AttachmentFile[] = useMemo(() => {
    if (!revisions.length) return [];

    return revisions.flatMap((rev) =>
      (rev.files ?? []).map((f) => ({
        id: `${f.source ?? "REVISION"}-${f.id}`, // unique key across sources
        fileId: f.id,
        fileName: f.originalFilename,
        revision: String(rev.revisionNumber ?? 0).padStart(2, "0"),
        isAttachment: f.fileRole !== "MAIN",
        source: f.source,
      })),
    );
  }, [revisions]);

  const currentSteps = useMemo<WorkflowStep[]>(() => {
    if (!currentStatus) return [];

    const baseSteps: WorkflowStep[] = [
      { label: STATUS_LABELS.DRAFT, apiStatus: "DRAFT" },
      { label: STATUS_LABELS.SUBMITTED, apiStatus: "SUBMITTED" },
      { label: STATUS_LABELS.UNDER_REVIEW, apiStatus: "UNDER_REVIEW" },
      { label: STATUS_LABELS.COMMENTS_ISSUED, apiStatus: "COMMENTS_ISSUED" },
      { label: STATUS_LABELS.REVIEW_COMPLETED, apiStatus: "REVIEW_COMPLETED" },
    ];

    let recommendationStep: WorkflowStep | null = null;
    let finalStep: WorkflowStep | null = null;

    const isRecommendedApproval =
      currentStatus === "RECOMMENDED_APPROVAL" || currentStatus === "APPROVED";
    const isRecommendedRejection =
      currentStatus === "RECOMMENDED_REJECTION" || currentStatus === "REJECTED";
    const isResubmissionDecision = currentStatus === "RESUBMISSION_REQUIRED";

    if (isRecommendedApproval) {
      recommendationStep = {
        label: STATUS_LABELS.RECOMMENDED_APPROVAL,
        apiStatus: "RECOMMENDED_APPROVAL",
      };
    } else if (isRecommendedRejection) {
      recommendationStep = {
        label: STATUS_LABELS.RECOMMENDED_REJECTION,
        apiStatus: "RECOMMENDED_REJECTION",
      };
    } else if (isResubmissionDecision) {
      finalStep = {
        label: STATUS_LABELS.RESUBMISSION_REQUIRED,
        apiStatus: "RESUBMISSION_REQUIRED",
      };
    }

    if (currentStatus === "APPROVED") {
      finalStep = { label: STATUS_LABELS.APPROVED, apiStatus: "APPROVED" };
    } else if (currentStatus === "REJECTED") {
      finalStep = { label: STATUS_LABELS.REJECTED, apiStatus: "REJECTED" };
    }

    const steps: WorkflowStep[] = [
      ...baseSteps,
      ...(recommendationStep ? [recommendationStep] : []),
      ...(finalStep ? [finalStep] : []),
    ];

    return steps.map((step) => ({
      ...step,
      isCurrent: step.apiStatus === currentStatus,
    }));
  }, [currentStatus]);

  const handlePreviewAttachment = (file: AttachmentFile) => {
    if (!doc) return;
    previewFile({
      documentId: doc.documentId,
      fileId: file.fileId,
      source: file.source,
    });
  };

  const handleDownloadAttachment = (file: AttachmentFile) => {
    if (!doc) return;
    downloadFile({
      documentId: doc.documentId,
      fileId: file.fileId,
      source: file.source,
      fallbackFilename: file.fileName,
    });
  };

  const handlePreviewMainFile = () => {
    if (!doc) return;
    const mainFile = currentRevision?.files?.find((f) => f.fileRole === "MAIN");
    if (mainFile) {
      previewFile({
        documentId: doc.documentId,
        fileId: mainFile.id,
        source: mainFile.source ?? "REVISION",
      });
    }
  };

  const handleDownloadCurrent = () => {
    if (!doc) return;
    const mainFile = currentRevision?.files?.find((f) => f.fileRole === "MAIN");

    if (!mainFile) return;
    downloadFile({
      documentId: doc.documentId,
      fileId: mainFile.id,
      source: mainFile.source ?? "REVISION",
      fallbackFilename: doc.title,
    });
  };

  if (isLoading || meLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-gray-500">Loading document details…</p>
      </div>
    );
  }

  if (isError || !doc) {
    return (
      <div className="flex h-full flex-col items-start gap-4 p-8">
        <p className="text-sm text-gray-600">Document not found.</p>
        <Button
          variant="outline"
          onClick={() => navigate("/documents-tracking")}
        >
          Back to Tracking
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0">
        <PageBreadcrumb
          items={[
            { label: "Administration", href: "/" },
            { label: "Listing", href: "/documents-tracking" },
            { label: doc.title },
          ]}
        />
        <PageHeader
          title={doc.title}
          description={`${doc.documentTrackingId} · DOC-${doc.documentId}`}
        />
      </div>

      <div className="mb-6 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[#EEF5FB] px-3 py-1 text-[12px] text-[#29688E]">
            Current Rev{" "}
            {String(doc.revision?.revisionNumber ?? 0).padStart(2, "0")}
          </span>
          <span className="rounded-full bg-[#E9F2FA] px-2.5 py-1 text-[11px] font-medium tracking-[0.0644531px] text-[#246492]">
            {currentStatus ? STATUS_LABELS[currentStatus] : "—"}
          </span>
        </div>

        <div className="pt-[18px]">
          <DocumentActionButtons
            documentId={doc.documentId}
            revisionId={doc.revision?.id}
            recommendationId={doc.recommendation?.id}
            status={doc.revision?.status}
            documentTrackingId={doc.documentTrackingId || ""}
            revisionNumber={doc.revision?.revisionNumber || 0}
            orgType={String(me?.organization?.type ?? "").toUpperCase()}
            onEditMetadata={() => setIsEditModalOpen(true)}
            onDownload={handleDownloadCurrent}
            isDownloading={downloadingId === doc.documentId}
          />
        </div>
      </div>

      <div className="mb-4 flex border-b border-[#DCE5ED]">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex h-[34px] items-center justify-center px-3 text-[13px] tracking-[-0.0761719px] transition-colors ${
              activeTab === tab
                ? "bg-white font-bold text-[#075D94] shadow-[inset_0px_-3px_0px_#1675AF]"
                : "cursor-pointer font-normal text-[#243B51] hover:bg-gray-50/50 hover:font-bold hover:text-[#075D94]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-8 overflow-auto">
        {activeTab === "Overview" && (
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="w-full lg:w-2/3">
              <DocumentMetadataCard document={doc} />
            </div>
            <div className="w-full lg:w-1/3">
              <OverviewSidebar
                currentRevision={String(
                  doc.revision?.revisionNumber ?? 0,
                ).padStart(2, "0")}
                submissionDate={
                  doc.revision?.submissionDate
                    ? format(
                        new Date(doc.revision.submissionDate),
                        "dd/MM/yyyy",
                      )
                    : undefined
                }
                onPreviewFile={handlePreviewMainFile}
                approvedRevisionText={
                  doc.revision?.approvalDate
                    ? `Approved on ${format(new Date(doc.revision.approvalDate), "dd/MM/yyyy")}`
                    : "No approval recorded."
                }
                workflowSteps={currentSteps}
              />
            </div>
          </div>
        )}

        {activeTab === "Attachments" &&
          (revisionsLoading ? (
            <p className="text-sm text-gray-500">Loading attachments…</p>
          ) : (
            <AttachmentsTab
              files={attachmentFiles}
              onPreview={handlePreviewAttachment}
              onDownload={handleDownloadAttachment}
              onUpload={(files) => console.log("Upload", files)}
            />
          ))}
        {activeTab === "Review Rounds" && (
          <ReviewRoundsTab
            onViewComments={(revisionId) => {
              // Set the revision ID for the comments tab
              setCommentsRevisionId(revisionId);
              // Switch to the comments tab
              setActiveTab("Comments & Responses");
            }}
          />
        )}
        {activeTab === "Comments & Responses" && (
          <CommentsAndResponsesTab
            documentId={doc.documentId}
            revisionId={commentsRevisionId ?? (doc.revision?.id || 0)}
          />
        )}

        {activeTab === "Revision History" && <DocumentRevisionHistory />}

        {activeTab === "Activity" && <DocumentActivityTab />}
      </div>

      <EditDocumentMetadataDialog
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        document={doc}
      />
    </div>
  );
};

export default SubmissionDetailsPage;
