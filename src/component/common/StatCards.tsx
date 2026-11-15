import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export interface StatItem {
  label: string;
  value: ReactNode;
}

interface StatCardsProps {
  items: StatItem[];
  loading?: boolean;
}

const StatCards = ({ items, loading = false }: StatCardsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-lg border border-gray-200 bg-white px-5 py-4"
        >
          <p className="text-xs text-[#6E8295]">{item.label}</p>
          {loading ? (
            <Skeleton className="mt-3 h-8 w-12" />
          ) : (
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {item.value}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default StatCards;
