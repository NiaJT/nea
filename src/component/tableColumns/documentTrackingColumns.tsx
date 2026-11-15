import type { Column } from "@/component/userPages/DataTable";
import { LuArrowRight } from "react-icons/lu";
import type { IDocumentTrackingItem } from "@/type/document.type";
import { DocumentStatusBadge } from "../document/StatusBadge"; // 👈 Added

interface GetDocumentTrackingColumnsArgs {
  onView: (row: IDocumentTrackingItem) => void;
}

export const getDocumentTrackingColumns = ({
  onView,
}: GetDocumentTrackingColumnsArgs): Column<IDocumentTrackingItem>[] => [
  {
    key: "tracking",
    header: "Tracking / document",
    headerClassName: "pl-6",
    className: "pl-6",
    cell: (row) => (
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-medium text-[#17283C]">
          {row.documentTrackingId || "—"}
        </span>
        <span className="text-xs text-[#718499]">{row.title}</span>
      </div>
    ),
  },
  {
    key: "title",
    header: "Title",
    cell: (row) => <span className="text-xs text-[#17283C]">{row.title}</span>,
  },
  {
    key: "packageContractor",
    header: "Package / contractor",
    cell: (row) => (
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-[#17283C]">{row.packageName}</span>
        <span className="text-xs text-[#718499]">{row.contractorName}</span>
      </div>
    ),
  },
  {
    key: "revision",
    header: "Revision",
    cell: (row) => (
      <span className="text-xs text-[#17283C]">
        {String(row.revisionNumber).padStart(2, "0")}
      </span>
    ),
  },
  {
    key: "submission",
    header: "Submission",
    cell: (row) => (
      <span className="text-xs text-[#17283C]">
        {row.submissionDate ?? "—"}
      </span>
    ),
  },
  {
    key: "reviewer",
    header: "Reviewer",
    cell: (row) => {
      const reviewers = row.reviewers ?? [];
      if (reviewers.length === 0) {
        return <span className="text-xs text-[#17283C]">Unassigned</span>;
      }
      const visible = reviewers.slice(0, 2);
      const remaining = reviewers.length - visible.length;
      return (
        <div className="flex flex-col gap-0.5">
          {visible.map((r) => (
            <span key={r.id} className="text-xs text-[#17283C]">
              {r.fullName}
            </span>
          ))}
          {remaining > 0 && (
            <span
              className="text-xs text-[#718499]"
              title={reviewers
                .slice(2)
                .map((r) => r.fullName)
                .join(", ")}
            >
              +{remaining} more
            </span>
          )}
        </div>
      );
    },
  },
  {
    key: "due",
    header: "Due / SLA",
    cell: (row) => {
      // Backend might use slaState instead of overdue boolean
      const isOverdue = row.overDue || row.slaState === "OVERDUE";
      return (
        <div className="flex flex-col gap-1">
          <span className="text-xs text-[#17283C]">{row.dueDate ?? "—"}</span>
          {isOverdue && (
            <span className="inline-flex h-[23px] w-fit items-center rounded-full bg-[#FDE9E9] px-2 text-[11px] leading-[13px] tracking-[0.0645px] text-[#A52F37]">
              Overdue
            </span>
          )}
        </div>
      );
    },
  },
  {
    key: "status",
    header: "Status",
    // 👇 Same badge component used on the Listing page
    cell: (row) => <DocumentStatusBadge status={row.status} />,
  },
  {
    key: "actions",
    header: "Actions",
    headerClassName: "pr-6",
    className: "pr-6",
    cell: (row) => (
      <button
        type="button"
        onClick={() => onView(row)}
        className="inline-flex cursor-pointer items-center gap-1 text-xs font-bold text-[#126BA3] hover:underline"
      >
        View
        <LuArrowRight className="size-3" />
      </button>
    ),
  },
];
