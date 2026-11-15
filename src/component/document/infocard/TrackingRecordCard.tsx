import { useNavigate } from "react-router";

export interface TrackingRecord {
  id: string;
  status: string;
  round: string;
  revision: string;
  reviewer?: string;
  workflowHref?: string;
  onOpenWorkflow?: () => void;
}

interface TrackingRecordsCardProps {
  epicId: string;
  records: TrackingRecord[];
  /** Fallback label if you want to override "Open workflow →". */
  actionLabel?: string;
}

export const TrackingRecordsCard = ({
  epicId,
  records,
  actionLabel = "Open workflow →",
}: TrackingRecordsCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl border border-[#E1E9F1] bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-[14px] font-bold leading-[17px] tracking-[-0.150391px] text-[#17283C]">
        Tracking records · {epicId}
      </h2>

      <div className="flex flex-col gap-3">
        {records.length === 0 && (
          <p className="text-[13px] text-[#73869A]">No tracking records yet.</p>
        )}

        {records.map((record) => {
          const handleOpen = () => {
            if (record.onOpenWorkflow) return record.onOpenWorkflow();
            if (record.workflowHref) return navigate(record.workflowHref);
          };

          return (
            <div
              key={record.id}
              className="flex flex-col gap-2 rounded-r-md border-l-[3px] border-[#2C84B4] bg-[#F2F8FC] p-4"
            >
              <span className="text-[16px] font-bold leading-[19px] tracking-[-0.3125px] text-[#17283C]">
                {record.id}
              </span>

              {/* Updated to show reviewer */}
              <span className="text-[11px] leading-[13px] tracking-[0.0644531px] text-[#6A8296]">
                {record.status} · {record.round} · Rev {record.revision}
                {record.reviewer && ` · Reviewer: ${record.reviewer}`}
              </span>

              <button
                type="button"
                onClick={handleOpen}
                className="mt-1 self-start text-[12px] font-bold text-[#126BA3] hover:underline"
              >
                {actionLabel}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
