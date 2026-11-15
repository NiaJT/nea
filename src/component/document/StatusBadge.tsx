import type { DocumentStatus } from "@/type/document.type";
import { cn } from "@/lib/utils";

// Backend enum: DRAFT, SUBMITTED, UNDER_REVIEW, COMMENTS_ISSUED,
// RESUBMISSION_REQUIRED, REVIEW_COMPLETED, RECOMMENDED,
// RECOMMENDED_APPROVAL, RECOMMENDED_REJECTION, REQUIRE_RESUBMISSION,
// APPROVED, REJECTED, SUPERSEDED, ARCHIVED

const LABELS: Record<string, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  COMMENTS_ISSUED: "Comments Issued",
  RESUBMISSION_REQUIRED: "Resubmission Required",
  REVIEW_COMPLETED: "Review Completed",
  RECOMMENDED: "Recommended",
  RECOMMENDED_APPROVAL: "Recommended Approval",
  RECOMMENDED_REJECTION: "Recommend Rejection",
  RECOMMENDED_RESUBMISSION: "Recommend Resubmission", // 👈 Added
  APPROVED: "Approved",
  REJECTED: "Rejected",
  SUPERSEDED: "Superseded",
  ARCHIVED: "Archived",
  CANCELLED: "Cancelled", // 👈 Added
};

const STYLES: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700 border-gray-200",
  SUBMITTED: "bg-blue-50 text-blue-700 border-blue-200",
  UNDER_REVIEW: "bg-amber-50 text-amber-700 border-amber-200",
  COMMENTS_ISSUED: "bg-orange-50 text-orange-700 border-orange-200",
  RESUBMISSION_REQUIRED: "bg-red-50 text-red-700 border-red-200",
  REVIEW_COMPLETED: "bg-teal-50 text-teal-700 border-teal-200",
  RECOMMENDED: "bg-indigo-50 text-indigo-700 border-indigo-200",
  RECOMMENDED_APPROVAL: "bg-emerald-50 text-emerald-700 border-emerald-200",
  RECOMMENDED_REJECTION: "bg-red-50 text-red-700 border-red-200",
  RECOMMENDED_RESUBMISSION: "bg-[#FFF2DA] text-[#9D600D] border-[#F3D9A8]",
  APPROVED: "bg-emerald-100 text-emerald-800 border-emerald-300",
  REJECTED: "bg-red-100 text-red-800 border-red-300",
  SUPERSEDED: "bg-gray-100 text-gray-500 border-gray-200",
  ARCHIVED: "bg-gray-200 text-gray-600 border-gray-300",
  CANCELLED: "bg-gray-100 text-gray-500 border-gray-200 line-through",
};

interface DocumentStatusBadgeProps {
  status: DocumentStatus | string;
}

export const DocumentStatusBadge = ({ status }: DocumentStatusBadgeProps) => {
  const key = String(status ?? "").toUpperCase();
  const label = LABELS[key] ?? key.replace(/_/g, " ").toLowerCase();
  const style = STYLES[key] ?? "bg-gray-100 text-gray-700 border-gray-200";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        style,
      )}
    >
      {label}
    </span>
  );
};
