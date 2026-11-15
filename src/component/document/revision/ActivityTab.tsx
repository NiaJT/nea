import { useParams } from "react-router";
import { useDocumentActivities } from "@/action/useDocuments";
import ActivityHistoryList from "@/component/document/RevisionHistoryList";

export const DocumentActivityTab = () => {
  const { id } = useParams<{ id: string }>();
  const numericId = id ? Number(id) : undefined;

  const { data: activitiesResponse, isLoading } =
    useDocumentActivities(numericId);
  const activities = activitiesResponse?.data ?? [];

  if (isLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-xl border border-[#E1E9F1] bg-white shadow-sm">
        <p className="text-sm text-gray-500">Loading activity…</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#E1E9F1] bg-white p-5 shadow-[0px_2px_9px_rgba(21,58,97,0.03)]">
      <h3 className="text-[14px] font-bold leading-[17px] tracking-[-0.150391px] text-[#17283C]">
        Activity history
      </h3>
      <div className="mt-4 flex flex-col gap-2.5">
        {activities.length > 0 ? (
          <ActivityHistoryList activities={activities} />
        ) : (
          <p className="text-sm text-gray-500">No activity recorded yet.</p>
        )}
      </div>
    </div>
  );
};
