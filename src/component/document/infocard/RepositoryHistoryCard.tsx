import { format } from "date-fns";
import { useDocumentActivities } from "@/action/useDocuments";
import { useParams } from "react-router";
export interface RepositoryHistoryItem {
  message: string;
  timestamp: string | null | undefined;
  user?: string;
}
const formatTs = (iso?: string | null) => {
  if (!iso) return null;
  try {
    return format(new Date(iso), "yyyy-MM-dd HH:mm");
  } catch {
    return iso;
  }
};

export const RepositoryHistoryCard = () => {
  const { id } = useParams<{ id: string }>();
  const numericId = id ? Number(id) : undefined;

  const { data: activitiesResponse, isLoading } =
    useDocumentActivities(numericId);
  const activities = activitiesResponse?.data ?? [];

  const items = activities.map((a) => ({
    message: a.action,
    timestamp: formatTs(a.createdAt),
    user: a.actorRole,
  }));

  return (
    <div className="rounded-xl border border-[#E1E9F1] bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-[14px] font-bold leading-[17px] tracking-[-0.150391px] text-[#17283C]">
        Repository history
      </h2>

      <div className="flex max-h-[320px] flex-col gap-2 overflow-y-auto pr-1">
        {isLoading && (
          <p className="text-[13px] text-[#73869A]">Loading activity…</p>
        )}

        {!isLoading && items.length === 0 && (
          <p className="text-[13px] text-[#73869A]">No history entries yet.</p>
        )}

        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-start justify-between gap-4 rounded-lg border border-[#DCE6EF] px-4 py-3"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[13.3333px] leading-[16px] tracking-[-0.099824px] text-[#73869A]">
                {item.message}
              </span>
              {item.user && (
                <span className="text-[11px] text-[#9CA3AF]">
                  By {item.user}
                </span>
              )}
            </div>

            {item.timestamp && (
              <span className="shrink-0 text-[11px] leading-[13px] text-[#9CA3AF]">
                {item.timestamp}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
