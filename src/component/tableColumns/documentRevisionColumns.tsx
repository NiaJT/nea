import type { Column } from "@/component/userPages/DataTable";
import type { IDocumentRevisionListItem } from "@/type/document.type";
import { DocumentStatusBadge } from "../document/StatusBadge";
import { FiDownload, FiEye } from "react-icons/fi";
import { cn } from "@/lib/utils";

export interface RevisionRow extends IDocumentRevisionListItem {
  isCurrent?: boolean;
  fileId?: number;
  contentType?: string;
  source?: string;
  fileName?: string;
}

interface GetRevisionColumnsArgs {
  onPreview?: (rev: RevisionRow) => void;
  onDownload?: (rev: RevisionRow) => void;
  downloadingId?: number | null;
}

export const getRevisionColumns = ({
  onPreview,
  onDownload,
  downloadingId,
}: GetRevisionColumnsArgs): Column<RevisionRow>[] => [
  {
    key: "revision",
    header: "Revision",
    headerClassName: "pl-6",
    className: "pl-6",
    cell: (row) => (
      <span className="text-xs font-normal text-[#17283C]">
        Rev {String(row.revisionNumber).padStart(2, "0")}
      </span>
    ),
  },
  {
    key: "submitted",
    header: "Submitted",
    cell: (row) => (
      <span className="text-xs font-normal text-[#17283C]">
        {row.submissionDate ?? "—"}
      </span>
    ),
  },
  {
    key: "submittedBy",
    header: "Submitted by",
    cell: (row) => (
      <span className="text-xs font-normal text-[#17283C]">
        {row.submittedBy ?? "—"}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => <DocumentStatusBadge status={row.status} />,
  },
  {
    key: "remarks",
    header: "Remarks",
    cell: (row) => (
      <span className="text-xs font-normal text-[#17283C]">
        {row.remarks || (row.isCurrent ? "Current revision" : "—")}
      </span>
    ),
  },
  {
    key: "actions",
    header: "Actions",
    headerClassName: "pr-6",
    className: "pr-6",
    cell: (row) => {
      const isDownloading = downloadingId === row.fileId;
      const hasFile = !!row.fileId;

      if (!hasFile) {
        return <span className="text-xs text-[#718499]">—</span>;
      }

      return (
        <div className="flex flex-col items-start gap-1.5">
          {onPreview && (
            <button
              type="button"
              onClick={() => onPreview(row)}
              className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-[#126BA3] transition-colors hover:text-[#0E2E4A]"
            >
              <FiEye className="size-3.5" />
              Preview
            </button>
          )}
          {onDownload && (
            <button
              type="button"
              onClick={() => onDownload(row)}
              disabled={isDownloading}
              className={cn(
                "inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-[#126BA3] transition-colors hover:text-[#0E2E4A]",
                isDownloading && "cursor-wait opacity-60",
              )}
            >
              <FiDownload className="size-3.5" />
              {isDownloading ? "Downloading..." : "Download"}
            </button>
          )}
        </div>
      );
    },
  },
];
