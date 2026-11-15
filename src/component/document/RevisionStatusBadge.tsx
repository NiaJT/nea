import type { RevisionStatus } from "@/type/document.type";

const REVISION_STYLES: Record<RevisionStatus, string> = {
  DRAFT: "bg-gray-100 text-gray-700 border-gray-200",
  UNDER_REVIEW: "bg-amber-50 text-amber-700 border-amber-200",
  APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  RESUBMISSION_REQUIRED: "bg-red-50 text-red-700 border-red-200",
  Current: "bg-[#FFF2DA] text-[#9D600D]",
  Superseded: "bg-[#EAEEF2] text-[#536779]",
};

interface RevisionStatusBadgeProps {
  status: RevisionStatus;
  className?: string;
}

export const RevisionStatusBadge = ({
  status,
  className,
}: RevisionStatusBadgeProps) => (
  <span
    className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] leading-none ${REVISION_STYLES[status]} ${className ?? ""}`}
  >
    {status}
  </span>
);

export default RevisionStatusBadge;
