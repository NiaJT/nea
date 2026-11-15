import { FiEdit } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RowActionsProps {
  active: boolean;
  onToggleActive?: (active: boolean) => void;
  onEdit?: () => void;
  onView?: () => void;
  onDelete?: () => void;
}

const itemClass =
  "cursor-pointer justify-center rounded-full bg-gray-50 py-1.5 text-sm font-normal text-gray-800 not-last:mb-2 focus:bg-gray-100";

const RowActions = ({
  active,
  onToggleActive,
  onEdit,
  onView,
  onDelete,
}: RowActionsProps) => (
  <div className="flex items-center gap-3">
    {onEdit && (
      <button
        type="button"
        onClick={onEdit}
        className="cursor-pointer text-slate-700 hover:text-slate-900"
      >
        <FiEdit size={18} />
      </button>
    )}

    {onToggleActive && (
      <Switch
        checked={active}
        onCheckedChange={onToggleActive}
        className="data-checked:bg-green-600 cursor-pointer"
      />
    )}

    {(onView || onDelete) && (
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
            <DropdownMenuItem onClick={onView} className={itemClass}>
              View
            </DropdownMenuItem>
          )}
          {onDelete && (
            <DropdownMenuItem onClick={onDelete} className={itemClass}>
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    )}
  </div>
);

export default RowActions;
