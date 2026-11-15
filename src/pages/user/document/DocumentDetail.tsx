import { useCallback, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { isAxiosError } from "axios";

import PageBreadcrumb from "@/component/userPages/PageBreadcrumb";
import PageHeader from "@/component/userPages/PageHeader";
import { Button } from "@/components/ui/button";
import NoPermission from "@/component/userPages/NoPermission";

import { useDocument, useDocumentRevisions } from "@/action/useDocuments";
import requests from "@/helper/requests";
import { errorToast } from "@/component/common/Toasts";
import { usePermissions } from "@/utils/usePermissions";
import { PERMISSIONS } from "@/utils/permissions";

import {
  DocumentRecordCard,
  type CardAction,
  type DocumentRecord,
} from "@/component/document/infocard/DocumentRecordCard";
import {
  RevisionFilesCard,
  type RevisionFile,
} from "@/component/document/infocard/RevisionFilesCard";
import {
  TrackingRecordsCard,
  type TrackingRecord,
} from "@/component/document/infocard/TrackingRecordCard";
import { RepositoryHistoryCard } from "@/component/document/infocard/RepositoryHistoryCard";
import { EditDocumentMetadataDialog } from "@/component/document/form/EditDocumentMetaDataDialog";
import { useFilePreview } from "@/hooks/useFilePreview";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const isPreviewable = (contentType: string) =>
  [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/gif",
    "image/webp",
    "text/plain",
  ].includes(contentType);

// ─── Component ───────────────────────────────────────────────────────────────

const DocumentDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const numericId = id ? Number(id) : undefined;

  const { can, isLoading: permLoading } = usePermissions();
  const canView = can(PERMISSIONS.DOCUMENT.VIEW);
  const canPreview = can(PERMISSIONS.DOCUMENT.PREVIEW);
  const canDownload = can(PERMISSIONS.DOCUMENT.DOWNLOAD);

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useDocument(numericId, { enabled: canView });

  const { data: revisionsResponse, isLoading: revisionsLoading } =
    useDocumentRevisions(numericId, { enabled: canView });

  const revisions = revisionsResponse?.data ?? [];

  const isForbidden = isAxiosError(error) && error.response?.status === 403;
  const doc = response?.data;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // ─── File actions ──────────────────────────────────────────────────────────
  const { previewFile } = useFilePreview();
  const handlePreview = useCallback(
    (fileId: number, contentType: string) => {
      if (!doc || !isPreviewable(contentType) || !canPreview) return;

      // Just pass the IDs to the hook
      previewFile({
        documentId: doc.documentId,
        fileId,
      });
    },
    [doc, canPreview, previewFile],
  );
  const handleDownload = useCallback(
    async (fileId: number, fallbackName: string) => {
      if (!doc || !canDownload) return;
      try {
        const res = await requests.document.getDocumentFile(
          doc.documentId,
          fileId,
        );
        const blob = new Blob([res.data], {
          type:
            typeof res.headers["content-type"] === "string"
              ? res.headers["content-type"]
              : "application/octet-stream",
        });
        const url = window.URL.createObjectURL(blob);

        const disposition = res.headers["content-disposition"] as
          | string
          | undefined;
        const match = disposition?.match(
          /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i,
        );
        const filename = match?.[1]
          ? decodeURIComponent(match[1])
          : fallbackName;

        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      } catch (err) {
        console.error(err);
        errorToast("Download failed", "Could not download the file.");
      }
    },
    [doc, canDownload],
  );

  const record: DocumentRecord | null = useMemo(() => {
    if (!doc) return null;

    const approvedRevNumber = doc.revision?.approvalDate
      ? String(doc.revision.revisionNumber ?? 0).padStart(2, "0")
      : null;

    return {
      epicId: doc.documentTrackingId || `DOC-${doc.documentId}`,
      documentId: `DOC-${doc.documentId}`,
      number: doc.documentTrackingId || "—",
      title: doc.title,
      type: doc.documentType?.name || "—",
      project: doc.project?.name || "—",
      package: doc.projectPackage?.name || "—",
      contractor: doc.contractor?.orgName || "—",
      currentRevision: String(doc.revision?.revisionNumber ?? 0).padStart(
        2,
        "0",
      ),
      documentState: doc.revision?.status ?? "—",
      approvedRevision: approvedRevNumber,
      approvedBy: doc.revision?.approvedBy?.fullName ?? null,
    };
  }, [doc]);

  const trackingRecords: TrackingRecord[] = useMemo(() => {
    if (!doc?.revision) return [];

    // recommendedBy is the reviewer who recommended
    const reviewerName =
      doc.recommendation?.recommendedBy?.fullName ?? "Unassigned";

    return [
      {
        id: `TRK-${doc.documentId}-${doc.revision.revisionNumber}`,
        status: doc.revision.status ?? "—",
        round: doc.recommendation?.roundNumber
          ? `Round ${doc.recommendation.roundNumber}`
          : "Round 1",
        revision: String(doc.revision.revisionNumber ?? 0).padStart(2, "0"),
        reviewer: reviewerName,
        workflowHref: `/documents-tracking/details/${doc.documentId}`,
      },
    ];
  }, [doc]);

  const revisionFiles: RevisionFile[] = useMemo(() => {
    if (!revisions.length) return [];

    const files: RevisionFile[] = [];

    revisions.forEach((rev) => {
      const revisionWithFiles = rev as typeof rev & {
        files?: Array<{
          id: number;
          fileRole: string;
          originalFilename: string;
          contentType: string;
        }>;
      };
      const mainFile = revisionWithFiles.files?.find(
        (f) => f.fileRole === "MAIN",
      );
      const contentType = mainFile?.contentType;
      if (!mainFile || typeof contentType !== "string" || !contentType) return;

      files.push({
        revision: String(rev.revisionNumber).padStart(2, "0"),
        label: mainFile.originalFilename,
        onPreview:
          isPreviewable(contentType) && canPreview
            ? () => handlePreview(mainFile.id, contentType)
            : undefined,
        onDownload: canDownload
          ? () => handleDownload(mainFile.id, mainFile.originalFilename)
          : undefined,
      });
    });

    // Sort newest → oldest
    return files.sort((a, b) => Number(b.revision) - Number(a.revision));
  }, [revisions, handlePreview, handleDownload, canPreview, canDownload]);

  // ─── Loading / error states ───────────────────────────────────────────────

  if (permLoading) {
    return <p className="p-6 text-sm text-gray-500">Loading…</p>;
  }

  if (!canView || isForbidden) {
    return (
      <NoPermission message="You don't have permission to view this document." />
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-gray-500">Loading document…</p>
      </div>
    );
  }

  if (isError || !doc || !record) {
    return (
      <div className="flex h-full flex-col items-start gap-4">
        <p className="text-sm text-gray-600">Document not found.</p>
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={() => navigate("/documents")}
        >
          Back to Documents
        </Button>
      </div>
    );
  }

  // ─── Actions ───────────────────────────────────────────────────────────────

  const actions: CardAction[] = [];

  if (!doc.documentTrackingId) {
    if (doc.revision?.status === "DRAFT") {
      actions.push({
        label: "Edit metadata",
        onClick: () => setIsEditModalOpen(true),
        variant: "light",
      });
    }
    actions.push({
      label: "Submit for review",
      onClick: () =>
        navigate(`/documents/register-submission?documentId=${doc.documentId}`),
      variant: "dark",
    });
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen flex-col bg-[#F6F9FB]">
      <div className="mb-6 shrink-0">
        <PageBreadcrumb
          items={[
            { label: "Documents", href: "/documents" },
            { label: "detail", href: `/documents/${doc.documentId}` },
          ]}
        />
        <PageHeader
          title={doc.title}
          description={[doc.documentTrackingId, `DOC-${doc.documentId}`]
            .filter(Boolean)
            .join(" · ")}
        />
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        {/* ─── Left Column ─── */}
        <div className="flex w-full flex-col gap-4 lg:w-2/3">
          <DocumentRecordCard record={record} actions={actions} />

          {revisionsLoading ? (
            <div className="rounded-xl border border-[#E1E9F1] bg-white p-5 shadow-sm">
              <p className="text-[13px] text-[#73869A]">Loading revisions...</p>
            </div>
          ) : (
            revisionFiles.length > 0 && (
              <RevisionFilesCard files={revisionFiles} />
            )
          )}
        </div>

        {/* ─── Right Column ─── */}
        {/* ─── Right Column ─── */}
        <div className="flex w-full flex-col gap-4 lg:w-1/3">
          {doc.documentTrackingId && (
            <TrackingRecordsCard
              epicId={doc.documentTrackingId}
              records={trackingRecords}
            />
          )}
          <RepositoryHistoryCard />
        </div>
      </div>

      <EditDocumentMetadataDialog
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        document={doc}
      />
    </div>
  );
};

export default DocumentDetail;
