import type { Column } from "@/component/userPages/DataTable";
import RowActions from "@/component/userPages/RowActions";
import { cn } from "@/lib/utils";
import {
  DOCUMENT_TYPE_STATUS_LABELS,
  DOCUMENT_TYPE_STATUS_STYLES,
  type IDocumentTypeOption,
} from "@/type/document.type";

interface DocumentTypeColumnOptions {
  onToggle?: (docType: IDocumentTypeOption, active: boolean) => void;
  onEdit?: (docType: IDocumentTypeOption) => void;
  onView?: (docType: IDocumentTypeOption) => void;
  onDelete?: (docType: IDocumentTypeOption) => void;
}

export const getDocumentTypeColumns = (
  action: DocumentTypeColumnOptions,
): Column<IDocumentTypeOption>[] => [
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
    cell: (d) => (
      <span
        className={cn(
          "rounded-full px-3 py-1 text-xs font-medium",
          DOCUMENT_TYPE_STATUS_STYLES[d.status],
        )}
      >
        {DOCUMENT_TYPE_STATUS_LABELS[d.status]}
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
