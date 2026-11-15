import { LuPencil, LuEllipsisVertical } from "react-icons/lu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface RoleCardMenuProps {
  onEdit: () => void;
  disableEdit?: boolean;
}

const RoleCardMenu = ({ onEdit, disableEdit = false }: RoleCardMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        onClick={(e) => e.stopPropagation()}
        className="shrink-0 cursor-pointer rounded p-0.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 focus:outline-none data-popup-open:bg-gray-100"
        aria-label="Role actions"
      >
        <LuEllipsisVertical className="size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        onClick={(e) => e.stopPropagation()}
        className="w-40"
      >
        <DropdownMenuItem
          disabled={disableEdit}
          onClick={() => !disableEdit && onEdit()}
          title={disableEdit ? "You don't have permission" : undefined}
          className={cn(
            "cursor-pointer gap-2 text-sm",
            disableEdit &&
              "data-disabled:pointer-events-auto data-disabled:cursor-not-allowed data-disabled:opacity-40",
          )}
        >
          <LuPencil className="size-4" />
          Edit Role
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RoleCardMenu;
