import { cn } from "@/lib/utils";
import {
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_STYLES,
  type ProjectStatus,
} from "@/type/project.type";

const StatusBadge = ({ status }: { status: ProjectStatus }) => (
  <span
    className={cn(
      "inline-block rounded-full px-2.5 py-1 text-xs font-medium",
      PROJECT_STATUS_STYLES[status],
    )}
  >
    {PROJECT_STATUS_LABELS[status]}
  </span>
);

export default StatusBadge;
