import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { UserStatus } from "@/type/user.type";

const STYLES: Record<UserStatus, string> = {
  ACTIVE: "bg-green-100 text-green-700 hover:bg-green-200",
  INACTIVE: "bg-[#FCE9E9] text-[#AA3B42] hover:bg-red-200",
  SUSPENDED: "bg-red-100 text-red-700 hover:bg-red-200",
};

const LABELS: Record<UserStatus, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  SUSPENDED: "Suspended",
};

const StatusBadge = ({
  status,
  className,
}: {
  status: UserStatus;
  className?: string;
}) => (
  <Badge
    className={cn(
      "w-24 justify-center rounded-md px-0 py-1.5 text-xs font-normal shadow-none",
      STYLES[status],
      className,
    )}
  >
    {LABELS[status]}
  </Badge>
);

export default StatusBadge;
