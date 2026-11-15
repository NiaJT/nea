import { Link } from "react-router";
import { FiArrowRight } from "react-icons/fi";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type StatTone = "default" | "danger" | "warning";

const VALUE_TONE: Record<StatTone, string> = {
  default: "text-[#243B51]",
  danger: "text-[#A83A3F]",
  warning: "text-[#9A6A2A]",
};

export interface StatCardProps {
  label: string;
  value: number | string;
  href?: string;
  linkLabel?: string;
  tone?: StatTone;
  className?: string;
  loading?: boolean;
}

const StatCard = ({
  label,
  value,
  href,
  linkLabel = "View filtered records",
  tone = "default",
  className,
  loading = false,
}: StatCardProps) => {
  const content = (
    <Card
      className={cn(
        "rounded-[12px] border-slate-200 bg-white shadow-none transition-colors",
        href && !loading && "hover:border-slate-300",
        className,
      )}
    >
      <CardContent className="flex flex-col gap-2 p-4">
        <span className="text-xs text-[#617589]">{label}</span>

        {loading ? (
          <div className="h-7 w-16 animate-pulse rounded bg-slate-200" />
        ) : (
          <span
            className={cn(
              "text-[28px] font-bold leading-none",
              VALUE_TONE[tone],
            )}
          >
            {value}
          </span>
        )}

        {href &&
          (loading ? (
            <div className="h-3 w-32 animate-pulse rounded bg-slate-100" />
          ) : (
            <span className="flex items-center gap-1 text-xs text-[#6D8396]">
              {linkLabel}
              <FiArrowRight className="size-3.5" />
            </span>
          ))}
      </CardContent>
    </Card>
  );

  if (!href || loading) return content;

  return (
    <Link
      to={href}
      className="block rounded-[12px] outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
    >
      {content}
    </Link>
  );
};

export default StatCard;
