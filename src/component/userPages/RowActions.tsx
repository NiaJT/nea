import type { ReactNode } from "react";
import { FiEdit } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface RowActionsProps {
  active: boolean;
  onToggleActive?: (active: boolean) => void;
  onEdit?: () => void;
  onView?: () => void;
  onDelete?: () => void;
  disableToggle?: boolean;
  disableEdit?: boolean;
  disableView?: boolean;
  disableDelete?: boolean;
}

const itemClass =
  "cursor-pointer justify-center rounded-full bg-gray-50 py-1.5 text-sm font-normal text-gray-800 not-last:mb-2 focus:bg-gray-100";

const disabledItemClass =
  "data-disabled:pointer-events-auto data-disabled:cursor-not-allowed data-disabled:opacity-40";

/** Shows a not-allowed cursor and blocks clicks on the wrapped control */
const Guard = ({
  disabled,
  children,
}: {
  disabled?: boolean;
  children: ReactNode;
}) =>
  disabled ? (
    <span
      className="inline-flex cursor-not-allowed opacity-40"
      title="You don't have permission"
    >
      <span className="pointer-events-none inline-flex" aria-disabled="true">
        {children}
      </span>
    </span>
  ) : (
    <>{children}</>
  );

const RowActions = ({
  active,
  onToggleActive,
  onEdit,
  onView,
  onDelete,
  disableToggle,
  disableEdit,
  disableView,
  disableDelete,
}: RowActionsProps) => (
  <div className="flex items-center gap-3">
    <Guard disabled={disableEdit}>
      <button
        type="button"
        onClick={onEdit}
        tabIndex={disableEdit ? -1 : undefined}
        className="cursor-pointer text-slate-700 hover:text-slate-900"
      >
        <FiEdit size={18} />
      </button>
    </Guard>

    <Guard disabled={disableToggle}>
      <Switch
        checked={active}
        onCheckedChange={(v) => onToggleActive?.(v)}
        tabIndex={disableToggle ? -1 : undefined}
        className="data-checked:bg-green-600 cursor-pointer"
      />
    </Guard>

    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            aria-label="More actions"
            className="cursor-pointer text-slate-400 outline-none hover:text-slate-700"
          />
        }
      >
        <BsThreeDotsVertical size={14} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-36 gap-1 rounded-lg bg-white p-1.5"
      >
        {onView && (
          <DropdownMenuItem
            disabled={disableView}
            onClick={onView}
            title={disableView ? "You don't have permission" : undefined}
            className={cn(itemClass, disabledItemClass)}
          >
            View
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          disabled={disableDelete}
          onClick={onDelete}
          title={disableDelete ? "You don't have permission" : undefined}
          className={cn(itemClass, disabledItemClass)}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);

export default RowActions;
