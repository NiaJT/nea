import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { LuLoaderCircle } from "react-icons/lu";

type ConfirmAlertDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
};

const ConfirmAlertDialog = ({
  open,
  onOpenChange,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  onConfirm,
  confirmText = "Delete",
  cancelText = "Cancel",
}: ConfirmAlertDialogProps) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[calc(100%-2rem)] overflow-hidden rounded-[8px] bg-white sm:max-w-md">
        <AlertDialogHeader className="min-w-0">
          <AlertDialogTitle className="wrap-break-word text-black">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="max-h-48 overflow-y-auto whitespace-normal break-all text-black">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="bg-white!">
          <AlertDialogCancel className="rounded-lg! text-black h-10 px-5 cursor-pointer bg-white! border border-[#0E2E4A]">
            {cancelText}
          </AlertDialogCancel>

          <AlertDialogAction
            className="rounded-lg! h-10 w-24 px-5 bg-[#AD241F]! hover:bg-red-800! text-white cursor-pointer"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <LuLoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              confirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmAlertDialog;
