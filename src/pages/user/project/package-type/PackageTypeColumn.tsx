import type { Column } from "@/component/userPages/DataTable";
import RowActions from "@/component/userPages/RowActions";
import { cn } from "@/lib/utils";
import {
  PACKAGE_TYPE_STATUS_LABELS,
  type IPackageType,
} from "@/type/packageType.type";
import { PROJECT_STATUS_STYLES } from "@/type/packageType.type";

interface PackageTypeColumnOptions {
  onToggle?: (packageType: IPackageType, active: boolean) => void;
  onEdit?: (packageType: IPackageType) => void;
  onView?: (packageType: IPackageType) => void;
  onDelete?: (packageType: IPackageType) => void;
}

export const getPackageTypeColumns = (
  action: PackageTypeColumnOptions,
): Column<IPackageType>[] => [
  {
    key: "name",
    header: "Name",
    className: "pl-6 text-sm text-gray-700",
    cell: (p) => p.name,
  },
  {
    key: "status",
    header: "Status",
    cell: (c) => (
      <span
        className={cn(
          "rounded-full px-3 py-1 text-xs font-medium",
          PROJECT_STATUS_STYLES[c.status],
        )}
      >
        {PACKAGE_TYPE_STATUS_LABELS[c.status]}
      </span>
    ),
  },

  {
    key: "actions",
    header: "Actions",
    cell: (p) => (
      <RowActions
        active={p.status === "ACTIVE"}
        onToggleActive={(active) => action.onToggle?.(p, active)}
        onEdit={() => action.onEdit?.(p)}
        // onView={() => action.onView?.(p)}
        onDelete={() => action.onDelete?.(p)}
      />
    ),
  },
];
