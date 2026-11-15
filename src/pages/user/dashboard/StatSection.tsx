import StatCard, { type StatCardProps } from "./StatCard";

interface StatSectionProps {
  title: string;
  stats: StatCardProps[];
  hint?: string;
  loading?: boolean;
}

const StatSection = ({
  title,
  stats,
  hint = "Open a metric to inspect records",
  loading = false,
}: StatSectionProps) => {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-[#1E293B]">{title}</h2>
        <span className="text-xs text-[#718499]">{hint}</span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} loading={loading} {...stat} />
        ))}
      </div>
    </section>
  );
};

export default StatSection;
