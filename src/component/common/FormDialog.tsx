import type { ReactNode } from "react";
import { FiX } from "react-icons/fi";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  className?: string;
  showClose?: boolean;
}

const FormDialog = ({
  open,
  onOpenChange,
  title,
  children,
  className,
  showClose = true,
}: FormDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent
      showCloseButton={false}
      className={cn("gap-6 rounded-lg bg-white p-8 sm:max-w-2xl", className)}
    >
      <DialogHeader className="flex-row items-center justify-between space-y-0">
        <DialogTitle className="text-xl font-semibold text-black">
          {title}
        </DialogTitle>
        {showClose && (
          <DialogClose
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-md cursor-pointer text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:outline-none"
          >
            <FiX className="h-5 w-5" />
          </DialogClose>
        )}
      </DialogHeader>
      {children}
    </DialogContent>
  </Dialog>
);

export default FormDialog;
