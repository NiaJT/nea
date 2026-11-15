import type { Column } from "@/component/userPages/DataTable";
import type { IDocumentListItem } from "@/type/document.type";
import { DocumentStatusBadge } from "../document/StatusBadge";
import { FiArrowRight } from "react-icons/fi";
import { cn } from "@/lib/utils";

interface GetDocumentColumnsArgs {
  onView: (doc: IDocumentListItem) => void;
  onDownload: (doc: IDocumentListItem) => void;
  downloadingId?: number | null;
  canView?: boolean;
  canDownload?: boolean;
}

export const getDocumentColumns = ({
  onView,
  onDownload,
  downloadingId,
  canView = true,
  canDownload = true,
}: GetDocumentColumnsArgs): Column<IDocumentListItem>[] => [
  {
    key: "document",
    header: "Document",
    headerClassName: "pl-6",
    className: "pl-6",
    cell: (row) => (
      <div className="flex flex-col">
        <span className="text-xs text-[#17283C]">Doc {row.id || "—"}</span>
        <span className="text-xs font-medium text-[#17283C]">{row.title}</span>
      </div>
    ),
  },
  {
    key: "project",
    header: "Project / package",
    cell: (row) => (
      <div className="flex min-w-0 max-w-62.5 flex-col gap-0.5">
        <span
          title={row.projectName}
          className="line-clamp-2 wrap-break-word text-xs text-[#17283C]"
        >
          {row.projectName}
        </span>
        <span
          title={row.packageName}
          className="line-clamp-2 wrap-break-word text-xs text-[#718499]"
        >
          {row.packageName}
        </span>
      </div>
    ),
  },
  {
    key: "type",
    header: "Type",
    cell: (row) => (
      <span className="text-xs text-[#17283C]">{row.documentTypeName}</span>
    ),
  },
  {
    key: "contractor",
    header: "Contractor",
    cell: (row) => (
      <span className="text-xs text-[#17283C]">{row.contractorName}</span>
    ),
  },
  {
    key: "submitted",
    header: "Submitted",
    cell: (row) => (
      <span className="text-xs text-[#17283C]">{row.submissionDate}</span>
    ),
  },
  {
    key: "revision",
    header: "Revision",
    cell: (row) => (
      <span className="text-xs text-[#17283C]">
        REV {String(row.revisionNumber).padStart(2, "0")}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => <DocumentStatusBadge status={row.status} />,
  },
  {
    key: "actions",
    header: "Actions",
    headerClassName: "pr-6",
    className: "pr-6",
    cell: (row) => {
      const isDownloading = downloadingId === row.id;

      return (
        <div className="flex flex-col items-start gap-1.5">
          {canView && (
            <button
              type="button"
              onClick={() => onView(row)}
              className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-[#126BA3] transition-colors hover:text-[#0E2E4A]"
            >
              View
              <FiArrowRight className="size-3.5" />
            </button>
          )}

          {canDownload && (
            <button
              type="button"
              onClick={() => onDownload(row)}
              disabled={isDownloading}
              className={cn(
                "inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-[#126BA3] transition-colors hover:text-[#0E2E4A]",
                isDownloading && "cursor-wait opacity-60 hover:text-[#126BA3]",
              )}
            >
              {isDownloading ? "Downloading..." : "Download"}
            </button>
          )}
        </div>
      );
    },
  },
];
