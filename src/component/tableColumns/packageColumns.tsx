import type { Column } from "../userPages/DataTable";
import RowActions from "../userPages/RowActions";
import {
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_STYLES,
  type IPackage,
} from "@/type/project.type";
import { cn } from "@/lib/utils";

interface PackageColumnsOptions {
  onToggleActive?: (pkg: IPackage, active: boolean) => void;
  onEdit?: (pkg: IPackage) => void;
  onView?: (pkg: IPackage) => void;
  onDelete?: (pkg: IPackage) => void;
}

export const getPackageColumns = ({
  onToggleActive,
  onEdit,
  onView,
  onDelete,
}: PackageColumnsOptions): Column<IPackage>[] => [
  {
    key: "number",
    header: "Number",
    className: "pl-6 text-sm text-gray-700",
    cell: (p) => p.number,
  },
  {
    key: "name",
    header: "Name",
    className: "text-sm text-gray-700",
    cell: (p) => (
      <div className="w-76 min-w-0 whitespace-normal lg:w-100">
        <p
          title={p.name}
          className="line-clamp-2 whitespace-normal wrap-break-word"
        >
          {p.name}
        </p>
      </div>
    ),
  },
  {
    key: "type",
    header: "Type",
    className: "text-sm text-gray-700",
    cell: (p) => p.type,
  },
  {
    key: "contractor",
    header: "Contractor",
    className: "text-sm text-gray-700",
    // cell: (p) => (p.contractors.length ? p.contractors.join(", ") : "-"),
    cell: (p) => p.contractor,
  },
  {
    key: "region",
    header: "Region",
    className: "text-sm text-gray-700",
    cell: (p) => p.region,
  },
  {
    key: "completion",
    header: "Completion",
    className: "text-sm text-gray-700",
    cell: (p) => p.completion,
  },
  {
    key: "status",
    header: "Status",
    cell: (p) => (
      <span
        className={cn(
          "inline-block rounded-full px-3 py-1 text-xs font-medium",
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
        onToggleActive={
          onToggleActive ? (a) => onToggleActive(p, a) : undefined
        }
        onEdit={onEdit ? () => onEdit(p) : undefined}
        onView={onView ? () => onView(p) : undefined}
        onDelete={onDelete ? () => onDelete(p) : undefined}
      />
    ),
  },
];
