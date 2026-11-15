import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LuEllipsisVertical, LuEye, LuPencil, LuTrash } from "react-icons/lu";

interface DocumentRowActionsProps {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const DocumentRowActions = ({
  onView,
  onEdit,
  onDelete,
}: DocumentRowActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        onClick={(e) => e.stopPropagation()}
        className="shrink-0 cursor-pointer rounded p-0.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 focus:outline-none data-popup-open:bg-gray-100"
        aria-label="Document actions"
      >
        <LuEllipsisVertical className="size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onClick={onView}
          className="cursor-pointer gap-2 text-sm"
        >
          <LuEye className="size-4" />
          View
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onEdit}
          className="cursor-pointer gap-2 text-sm"
        >
          <LuPencil className="size-4" />
          Edit
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onDelete}
          variant="destructive"
          className="cursor-pointer gap-2 text-sm"
        >
          <LuTrash className="size-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DocumentRowActions;
