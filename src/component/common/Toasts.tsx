import { toast } from "sonner";
import type { AxiosError } from "axios";

const closeButtonClass =
  "left-auto! right-3! top-3! transform-none! size-6! bg-transparent! border-0! text-white! hover:bg-white/20!";

export const successToast = (title: string, description?: string) => {
  toast.success(title, {
    description,
    closeButton: true,
    style: { background: "#16a34a", color: "#fff", border: "none" },
    classNames: {
      toast: "pr-12!",
      description: "text-white!",
      closeButton: closeButtonClass,
    },
  });
};

export const errorToast = (
  title: string,
  error?: AxiosError<{ message?: string }> | string,
) => {
  const description =
    typeof error === "string"
      ? error
      : error?.response?.data?.message ||
        "Something went wrong. Please try again.";

  toast.error(title, {
    description,
    closeButton: true,
    style: { background: "#dc2626", color: "#fff", border: "none" },
    classNames: {
      toast: "pr-12!",
      description: "text-white!",
      closeButton: closeButtonClass,
    },
  });
};
