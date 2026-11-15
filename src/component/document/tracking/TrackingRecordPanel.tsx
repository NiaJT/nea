import { cn } from "@/lib/utils";
import type { IDocumentTrackingRecord } from "@/type/document.type";

const InfoRow = ({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) => (
  <div className={cn("flex flex-col gap-1", className)}>
    <span className="text-[11px] leading-[13px] tracking-[0.0645px] text-[#77899A]">
      {label}
    </span>
    <span className="text-[13px] font-bold leading-4 tracking-[-0.0762px] text-[#17283C]">
      {value || "—"}
    </span>
  </div>
);

interface TrackingRecordPanelProps {
  doc: IDocumentTrackingRecord;
}

export const TrackingRecordPanel = ({ doc }: TrackingRecordPanelProps) => {
  return (
    <div className="rounded-xl border border-[#E1E9F1] bg-white p-[18px] shadow-[0px_2px_9px_rgba(21,58,97,0.03)]">
      <h3 className="text-sm font-bold leading-[17px] tracking-[-0.1504px] text-[#17283C]">
        Tracking record
      </h3>

      <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
        <InfoRow label="Tracking ID" value={doc.trackingId} />
        <InfoRow label="Tracking number" value={doc.documentTrackingId} />

        <InfoRow label="Document number" value={doc.documentNumber} />
        <InfoRow label="Title" value={doc.title} />

        <InfoRow label="Type" value={doc.type} />
        <InfoRow label="Project" value={doc.project} />

        <InfoRow label="Package" value={doc.package} />
        <InfoRow label="Contractor" value={doc.contractor} />

        <InfoRow label="Submission date" value={doc.submissionDate} />
        <InfoRow label="Received date" value={doc.receivedDate} />

        <InfoRow label="Revision" value={doc.revision} />
        <InfoRow label="Reviewer" value={doc.reviewer} />

        <InfoRow label="Review due date" value={doc.reviewDueDate} />
        <InfoRow label="Review date" value={doc.reviewDate} />

        <InfoRow label="Recommendation" value={doc.recommendation} />
        <InfoRow
          label="Recommendation rationale"
          value={doc.recommendationRationale}
        />

        <InfoRow label="Approval status" value={doc.approvalStatus} />
        <InfoRow label="Approval / decision date" value={doc.approvalDate} />

        <InfoRow label="Decision-maker" value={doc.decisionMaker} />
        <InfoRow label="Contractor response" value={doc.contractorResponse} />

        <InfoRow label="Resubmission date" value={doc.resubmissionDate} />
        <InfoRow label="Current status" value={doc.currentStatus} />

        <InfoRow
          label="Remarks"
          value={doc.remarks}
          className="sm:col-span-2"
        />
      </div>
    </div>
  );
};
