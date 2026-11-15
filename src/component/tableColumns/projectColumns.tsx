import {
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_STYLES,
  type IProject,
  type IProjectRow,
} from "@/type/project.type";
import { cn } from "@/lib/utils";
import type { Column } from "../userPages/DataTable";
import RowActions from "../userPages/RowActions";

interface ProjectColumnsOptions {
  onToggleActive?: (project: IProject, active: boolean) => void;
  onEdit?: (project: IProject) => void;
  onView?: (project: IProject) => void;
  onDelete?: (project: IProject) => void;
  canView?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
}

export const getProjectColumns = ({
  onToggleActive,
  onEdit,
  onView,
  onDelete,
  canView = true,
  canUpdate = true,
  canDelete = true,
}: ProjectColumnsOptions): Column<IProjectRow>[] => [
  {
    key: "code",
    header: "Project code",
    className: "pl-6 text-sm text-gray-700",
    cell: (p) => p.code,
  },
  {
    key: "name",
    header: "Project name",
    cell: (p) => (
      <div className="w-72 min-w-0 whitespace-normal lg:w-96">
        <p
          title={p.name}
          className="line-clamp-2 whitespace-normal wrap-break-word text-sm font-semibold text-slate-900"
        >
          {p.name}
        </p>
        <p
          title={p.rowPackage?.name}
          className="truncate text-xs text-gray-500"
        >
          {p.rowPackage?.code ?? "-"}
        </p>
      </div>
    ),
  },
  {
    key: "client",
    header: "Client",
    className: "text-sm text-gray-700",
    cell: () => "-",
  },
  {
    key: "consultant",
    header: "Consultant",
    className: "text-sm text-gray-700",
    cell: (p) => p.consultant?.orgName ?? "-",
  },
  {
    key: "start",
    header: "Start",
    className: "text-sm text-gray-700",
    cell: (p) => p.startDate ?? "-",
  },
  {
    key: "plannedCompletion",
    header: "Planned completion",
    className: "text-sm text-gray-700",
    cell: (p) => p.approxCompletionDate ?? "-",
  },
  // {
  //   key: "packages",
  //   header: "Packages",
  //   className: "text-sm text-gray-700",
  //   cell: () => "-",
  // },
  {
    key: "status",
    header: "Status",
    cell: (p) => (
      <span
        className={cn(
          "rounded-full px-3 py-1 text-xs font-medium",
          PROJECT_STATUS_STYLES[p.status],
        )}
      >
        {PROJECT_STATUS_LABELS[p.status]}
      </span>
    ),
  },
  {
    key: "actions",
    header: "Actions",
    cell: (p) => (
      <RowActions
        active={p.status === "ACTIVE"}
        onToggleActive={(active) => onToggleActive?.(p, active)}
        onEdit={() => onEdit?.(p)}
        onView={() => onView?.(p)}
        onDelete={() => onDelete?.(p)}
        disableToggle={!canUpdate}
        disableEdit={!canUpdate}
        disableView={!canView}
        disableDelete={!canDelete}
      />
    ),
  },
];
