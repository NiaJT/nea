import { useCallback, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import DataTable from "@/component/userPages/DataTable";
import { useDocument, useDocumentRevisions } from "@/action/useDocuments";
import {
  getRevisionColumns,
  type RevisionRow,
} from "@/component/tableColumns/documentRevisionColumns";
import { useFileDownload } from "@/hooks/useFileDownload";
import { useFilePreview } from "@/hooks/useFilePreview";
import { usePermissions } from "@/utils/usePermissions";
import { PERMISSIONS } from "@/utils/permissions";

const DocumentRevisionHistory = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const numericId = id ? Number(id) : undefined;

  const { can, isLoading: permLoading } = usePermissions();
  const canPreview = can(PERMISSIONS.DOCUMENT.PREVIEW);
  const canDownload = can(PERMISSIONS.DOCUMENT.DOWNLOAD);

  const { downloadFile } = useFileDownload();
  const { previewFile } = useFilePreview();

  const [downloadingFileId, setDownloadingFileId] = useState<number | null>(
    null,
  );

  const { data: docResponse, isLoading: docLoading } = useDocument(numericId);
  const { data: revisionsResponse, isLoading: revisionsLoading } =
    useDocumentRevisions(numericId);

  const doc = docResponse?.data;
  const revisions = revisionsResponse?.data ?? [];

  const handlePreview = useCallback(
    (rev: RevisionRow) => {
      if (!doc || !rev.fileId) return;
      previewFile({
        documentId: doc.documentId,
        fileId: rev.fileId,
        source: rev.source,
      });
    },
    [doc, previewFile],
  );
  const handleDownload = useCallback(
    async (rev: RevisionRow) => {
      if (!doc || !rev.fileId) return;
      setDownloadingFileId(rev.fileId);
      try {
        await downloadFile({
          documentId: doc.documentId,
          fileId: rev.fileId,
          source: rev.source,
          fallbackFilename:
            rev.fileName ?? `document-rev-${rev.revisionNumber}`,
        });
      } finally {
        setDownloadingFileId(null);
      }
    },
    [doc, downloadFile],
  );

  const columns = useMemo(
    () =>
      getRevisionColumns({
        onPreview: canPreview ? handlePreview : undefined,
        onDownload: canDownload ? handleDownload : undefined,
        downloadingId: downloadingFileId,
      }),
    [handlePreview, handleDownload, canPreview, canDownload, downloadingFileId],
  );

  const tableData: RevisionRow[] = useMemo(() => {
    return revisions.map((revision) => {
      const isCurrent =
        revision.revisionNumber === doc?.revision?.revisionNumber;

      const mainFile =
        revision.files?.find((f) => f.fileRole === "MAIN") ??
        revision.files?.[0];

      return {
        ...revision,
        isCurrent,
        fileId: mainFile?.id,
        contentType: mainFile?.contentType,
        source: mainFile?.source,
        fileName: mainFile?.originalFilename,
      };
    });
  }, [revisions, doc?.revision?.revisionNumber]);

  const isLoading = docLoading || revisionsLoading || permLoading;

  if (isLoading) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-xl border border-[#E1E9F1] bg-white">
        <p className="text-sm text-gray-500">Loading revision history…</p>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="flex h-[300px] flex-col items-center justify-center gap-4 rounded-xl border border-[#E1E9F1] bg-white">
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

  return (
    <div className="rounded-xl border border-[#E1E9F1] bg-white shadow-[0px_2px_9px_rgba(21,58,97,0.03)]">
      <div className="[&_.rounded-lg]:border-0 [&_.rounded-lg]:shadow-none [&_thead]:bg-[#F7FAFC] [&_th]:text-[12px] [&_th]:text-[#6E8295] [&_th]:h-[41px] [&_td]:py-[13px] [&_tr]:h-auto [&_tr]:border-[#E9EFF4]">
        <DataTable
          columns={columns}
          data={tableData}
          rowKey={(row) => String(row.revisionId ?? row.id)}
          emptyMessage="No revisions found"
          loading={revisionsLoading}
        />
      </div>
    </div>
  );
};

export default DocumentRevisionHistory;
