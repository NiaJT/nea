import type { ComponentProps } from "react";
import type { IconType } from "react-icons";
import { LuLoaderCircle } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DarkButtonProps extends ComponentProps<typeof Button> {
  icon?: IconType;
  loading?: boolean;
  loadingText?: string;
}

const DarkButton = ({
  icon: Icon,
  loading = false,
  loadingText = "Loading...",
  children,
  className,
  disabled,
  ...props
}: DarkButtonProps) => {
  return (
    <Button
      disabled={disabled || loading}
      className={cn(
        "h-11 w-full cursor-pointer rounded-lg bg-buttonBg text-sm font-normal text-white hover:bg-buttonBg/90 disabled:pointer-events-auto disabled:cursor-not-allowed disabled:opacity-80",
        className,
      )}
      {...props}
    >
      {loading ? (
        <>
          <LuLoaderCircle className="size-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        <>
          {Icon && <Icon className="size-4" />}
          {children}
        </>
      )}
    </Button>
  );
};

export default DarkButton;
