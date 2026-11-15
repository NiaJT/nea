import { cn } from "@/lib/utils";

export type DetailTab =
  | "Overview"
  | "Review Rounds"
  | "Comments & Responses"
  | "Attachments"
  | "History";

interface TrackingTabsProps {
  active: DetailTab;
  onChange: (tab: DetailTab) => void;
}

export const TrackingTabs = ({ active, onChange }: TrackingTabsProps) => {
  const detailTabs: DetailTab[] = [
    "Overview",
    "Review Rounds",
    "Comments & Responses",
    "Attachments",
    "History",
  ];

  return (
    <div className="mt-4 flex flex-row items-end gap-1 border-b border-[#DCE5ED]">
      {detailTabs.map((tab) => {
        const isActive = active === tab;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={cn(
              "flex items-center justify-center px-3 py-2 text-[13px] leading-4 tracking-[-0.0762px] transition-colors",
              isActive
                ? "rounded-t-md bg-white font-bold text-[#075D94] shadow-[inset_0_-3px_0_#1675AF]"
                : "font-normal text-[#243B51] hover:bg-gray-50",
            )}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
};
