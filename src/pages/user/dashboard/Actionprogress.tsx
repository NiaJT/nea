import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PROGRESS = [
  { key: "completed", label: "Completed", percent: 58, color: "bg-[#16836C]" },
  { key: "open", label: "Open", percent: 20, color: "bg-[#E2A641]" },
  { key: "overdue", label: "Overdue", percent: 7, color: "bg-[#C95157]" },
];

const SUMMARY = [
  {
    label: "Meeting actions due",
    count: 8,
    badge: "bg-[#FFF2DA] text-[#A15F08]",
  },
  {
    label: "Staff / site assignments",
    count: 36,
    badge: "bg-[#E9F2FA] text-[#246492]",
  },
  {
    label: "Vehicles with alerts",
    count: 3,
    badge: "bg-[#FFF2DA] text-[#A15F08]",
  },
];

const ActionProgress = () => {
  return (
    <Card className="rounded-[12px] border-[#E1E9F1] bg-white shadow-none">
      <CardHeader className="space-y-0 px-4 pt-2">
        <CardTitle className="text-base font-bold text-[#17283C]">
          Action progress
        </CardTitle>
        <p className="text-xs text-[#718499]">Across authorized records</p>
      </CardHeader>

      <CardContent className="px-6 pt-0">
        {/* progress bar */}
        <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-[#E9F0F6]">
          {PROGRESS.map((p) => (
            <div
              key={p.key}
              className={p.color}
              style={{ width: `${p.percent}%` }}
            />
          ))}
        </div>

        {/* legend */}
        <div className="mb-3 mt-3 flex items-center gap-4">
          {PROGRESS.map((p) => (
            <div key={p.key} className="flex items-center gap-1.5">
              <span className={`size-2.5 rounded-full ${p.color}`} />
              <span className="text-xs text-[#667A8B]">{p.label}</span>
            </div>
          ))}
        </div>

        {/* summary rows */}
        <ul className="divide-y divide-slate-100 border-t border-[#ECF1F5]">
          {SUMMARY.map((row) => (
            <li
              key={row.label}
              className="flex items-center justify-between py-3.5"
            >
              <span className="text-sm font-bold text-[#17283C]">
                {row.label}
              </span>
              <span
                className={`flex h-6 min-w-8 items-center justify-center rounded-full px-2 text-xs font-medium ${row.badge}`}
              >
                {row.count}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default ActionProgress;
