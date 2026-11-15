import { format } from "date-fns";
import type { IDocumentActivity } from "@/type/document.type";

interface ActivityHistoryListProps {
  activities: IDocumentActivity[];
}

const formatActivityDate = (iso: string) => {
  try {
    return format(new Date(iso), "yyyy-MM-dd");
  } catch {
    return iso;
  }
};

const ActivityHistoryList = ({ activities }: ActivityHistoryListProps) => {
  if (activities.length === 0) {
    return (
      <p className="py-6 text-center text-xs text-[#73869A]">
        No activity recorded yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex flex-row items-center justify-between rounded-[9px] border border-[#DCE6EF] px-3.5 py-3.5"
        >
          <div className="min-w-0">
            <p className="text-[13px] font-bold leading-4 tracking-[-0.0762px] text-[#17283C]">
              {activity.action}
            </p>
            <p className="mt-[5px] text-[13px] font-normal leading-4 tracking-[-0.0998px] text-[#73869A]">
              {formatActivityDate(activity.createdAt)} · {activity.actorRole}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityHistoryList;
