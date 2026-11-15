import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const StatusBadge = ({
  label,
  color,
}: {
  label: string;
  color: "blue" | "red" | "slate";
}) => {
  const styles = {
    blue: "bg-[#E9F2FA] text-[#246492]",
    red: "bg-[#FDE9E9] text-[#A52F37]",
    slate: "bg-[#EEF5FB] text-[#29688E]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-1 text-[11px] leading-[13px] tracking-[0.0645px]",
        styles[color],
      )}
    >
      {label}
    </span>
  );
};

interface TrackingStatusBarProps {
  status: string;
  revision: string;
  round?: string;
  overdue: boolean;
  onAssignReviewer?: () => void;
}

export const TrackingStatusBar = ({
  status,
  revision,
  round = "Round 1",
  overdue,
  onAssignReviewer,
}: TrackingStatusBarProps) => {
  return (
    <div className="rounded-xl border border-[#E1E9F1] bg-white p-[18px] shadow-[0px_2px_9px_rgba(21,58,97,0.03)]">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge label={status} color="blue" />
        <StatusBadge label={`Current Rev ${revision}`} color="slate" />
        <StatusBadge label={round} color="slate" />
        {overdue && <StatusBadge label="Overdue" color="red" />}
      </div>
      <div className="mt-4 flex items-center gap-2">
        <Button
          variant="outline"
          onClick={onAssignReviewer}
          className="h-[39px] rounded-lg border-[#D7E2EC] bg-white px-4 text-base font-normal text-[#243B51] hover:bg-[#F7FAFC]"
        >
          Assign reviewer
        </Button>
      </div>
    </div>
  );
};
