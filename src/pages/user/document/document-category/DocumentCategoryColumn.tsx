import type { Column } from "@/component/userPages/DataTable";
import RowActions from "@/component/userPages/RowActions";
import { cn } from "@/lib/utils";
import {
  DOCUMENT_CATEGORY_STATUS_LABELS,
  DOCUMENT_CATEGORY_STATUS_STYLES,
  type IDocumentCategory,
} from "@/type/packageCategory.type";

interface DocumentCategoryColumnOptions {
  onToggle?: (docType: IDocumentCategory, active: boolean) => void;
  onEdit?: (docType: IDocumentCategory) => void;
  onView?: (docType: IDocumentCategory) => void;
  onDelete?: (docType: IDocumentCategory) => void;
}

export const getDocumentCategoryColumns = (
  action: DocumentCategoryColumnOptions,
): Column<IDocumentCategory>[] => [
  {
    key: "name",
    header: "Name",
    className: "pl-6 text-sm text-gray-700",
    cell: (x) => x.name,
  },
  {
    key: "code",
    header: "Code",
    className: "text-sm text-gray-700",
    cell: (x) => x.code,
  },
  {
    key: "status",
    header: "Status",
    cell: (c) => (
      <span
        className={cn(
          "rounded-full px-3 py-1 text-xs font-medium",
          DOCUMENT_CATEGORY_STATUS_STYLES[c.status],
        )}
      >
        {DOCUMENT_CATEGORY_STATUS_LABELS[c.status]}
      </span>
    ),
  },
  {
    key: "actions",
    header: "Actions",
    cell: (x) => (
      <RowActions
        active={x.status === "ACTIVE"}
        onToggleActive={(active) => action.onToggle?.(x, active)}
        onEdit={() => action.onEdit?.(x)}
        onDelete={() => action.onDelete?.(x)}
      />
    ),
  },
];
