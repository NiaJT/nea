import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import { cn } from "@/lib/utils";
import DarkButton from "../common/DarkButton";

interface HeaderAction {
  label: string;
  onClick: () => void;
  icon?: IconType;
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  /** Default button on the right */
  action?: HeaderAction;
  /** Custom content on the right (overrides `action`), e.g. multiple buttons */
  actions?: ReactNode;
  className?: string;
}

const PageHeader = ({
  title,
  description,
  action,
  actions,
  className,
}: PageHeaderProps) => (
  <div className={cn("flex items-end justify-between gap-4", className)}>
    <div className="min-w-0 flex-1">
      <h1
        title={title}
        className="line-clamp-2 break-all text-3xl font-semibold text-black"
      >
        {title}
      </h1>
      {description && (
        <p className="mt-2 line-clamp-2 wrap-break-word text-base font-normal text-black">
          {description}
        </p>
      )}
    </div>

    {actions ? (
      <div className="shrink-0">{actions}</div>
    ) : (
      action && (
        <DarkButton
          icon={action.icon}
          onClick={action.onClick}
          loading={action.loading}
          loadingText={action.loadingText}
          disabled={action.disabled}
          className="h-10 w-auto shrink-0 gap-2 bg-[#0E2E4A] px-6 text-sm"
        >
          {action.label}
        </DarkButton>
      )
    )}
  </div>
);

export default PageHeader;

//without button
{
  /* <PageHeader title="Projects" description="All NEA projects and packages" /> */
}
