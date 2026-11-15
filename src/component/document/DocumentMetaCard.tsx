import { format } from "date-fns";
import type { IDocument } from "@/type/document.type";
import { useDocumentCategories } from "@/action/useDocumentCategory";
import { cn } from "@/lib/utils";

/* ───────────── Metadata row ───────────── */

interface MetadataRowProps {
  label: string;
  value: string;
  className?: string;
}

const MetadataRow = ({ label, value, className }: MetadataRowProps) => (
  <div className={cn("min-w-0", className)}>
    <p className="text-[11px] leading-3.25 tracking-[0.0644px] text-[#77899A]">
      {label}
    </p>
    <p
      title={value ?? undefined}
      className="mt-1.5 line-clamp-2 wrap-break-word text-[13px] font-bold leading-4 tracking-[-0.0762px] text-[#17283C]"
    >
      {value || "—"}
    </p>
  </div>
);

/* ───────────── Metadata card ───────────── */

export interface DocumentMetadataCardProps {
  document: IDocument;
}

const formatDate = (value: string | null | undefined) => {
  if (!value) return "—";
  try {
    return format(new Date(value), "yyyy-MM-dd");
  } catch {
    return value;
  }
};

const DocumentMetadataCard = ({ document: doc }: DocumentMetadataCardProps) => {
  const { data: categoriesRes } = useDocumentCategories();

  // ─── Resolved values (revision takes priority, doc is fallback) ───────────

  const submissionDate = doc.revision?.submissionDate ?? doc.submissionDate;
  const revisionNumber = doc.revision?.revisionNumber ?? doc.revisionNumber;
  const status = doc.revision?.status ?? doc.status;
  const approvalDate = doc.revision?.approvalDate ?? doc.approvalDate;
  const reviewer =
    doc.revision?.reviewers?.[0] ?? doc.revision?.submittedBy ?? doc.reviewer;
  const preparedBy = doc.revision?.submittedBy ?? doc.preparedBy;

  // Category name: prefer category object → categoryName → lookup by ID
  const categoryName =
    doc.category?.name ??
    categoriesRes?.data?.find((c) => c.id === doc.categoryId)?.name;

  return (
    <section className="overflow-auto rounded-xl border border-[#E1E9F1] bg-white p-5 shadow-[0px_2px_9px_rgba(21,58,97,0.03)]">
      <h3 className="text-sm font-bold leading-[17px] tracking-[-0.1504px] text-[#17283C]">
        Document metadata
      </h3>

      <div className="mt-4 grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">
        <MetadataRow label="Document ID" value={`DOC-${doc.documentId}`} />
        <MetadataRow label="Document title" value={doc.title} />
        <MetadataRow
          label="Document type"
          value={doc.documentType?.name ?? "—"}
        />
        <MetadataRow
          label="Tracking ID"
          value={doc.documentTrackingId ?? "—"}
        />
        <MetadataRow label="Project" value={doc.project?.name ?? "—"} />
        <MetadataRow label="Package" value={doc.projectPackage?.name ?? "—"} />
        <MetadataRow
          label="Contractor"
          value={doc.contractor?.orgName ?? "—"}
        />
        <MetadataRow
          label="Consultant"
          value={doc.consultant?.orgName ?? "—"}
        />
        <MetadataRow
          label="Submission date"
          value={formatDate(submissionDate)}
        />
        <MetadataRow
          label="Revision number"
          value={
            revisionNumber != null
              ? String(revisionNumber).padStart(2, "0")
              : "—"
          }
        />
        <MetadataRow label="Status" value={status ?? "—"} />
        <MetadataRow label="Prepared by" value={preparedBy?.fullName ?? "—"} />
        <MetadataRow
          label="Reviewer"
          value={reviewer?.fullName ?? "Unassigned"}
        />
        <MetadataRow label="Approval date" value={formatDate(approvalDate)} />
        <MetadataRow label="Category" value={categoryName ?? "—"} />
      </div>

      {/* Description */}
      <div className="mt-6">
        <h3 className="text-sm font-bold leading-[17px] tracking-[-0.1504px] text-[#17283C]">
          Description
        </h3>
        <p className="mt-3 text-base leading-[19px] tracking-[-0.3125px] text-[#6B7F91]">
          {doc.description || "—"}
        </p>
      </div>

      {/* Remarks */}
      <div className="mt-6">
        <h3 className="text-sm font-bold leading-[17px] tracking-[-0.1504px] text-[#17283C]">
          Remarks
        </h3>
        <p className="mt-3 text-base leading-[19px] tracking-[-0.3125px] text-[#6B7F91]">
          {doc.remarks || "—"}
        </p>
      </div>
    </section>
  );
};

export default DocumentMetadataCard;
