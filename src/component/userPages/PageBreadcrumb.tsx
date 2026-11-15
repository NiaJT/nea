import { Fragment, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { Link } from "react-router";

export interface BreadcrumbEntry {
  label: string;
  href?: string;
}

interface PageBreadcrumbProps {
  items: BreadcrumbEntry[];
  className?: string;
}

const HEADER_SLOT_ID = "header-breadcrumb";

const PageBreadcrumb = ({ items, className }: PageBreadcrumbProps) => {
  const [slot, setSlot] = useState<HTMLElement | null>(null);

  // The Header is already mounted by the time this effect runs
  useEffect(() => {
    setSlot(document.getElementById(HEADER_SLOT_ID));
  }, []);

  const MAX_CRUMB_CHARS = 40;

  const truncateLabel = (label: string, max = MAX_CRUMB_CHARS) =>
    label.length > max ? `${label.slice(0, max)}...` : label;

  const breadcrumb = (
    <Breadcrumb className="min-w-0">
      <BreadcrumbList className={cn("flex-nowrap text-base", className)}>
        {items.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === items.length - 1;
          const isMiddle = !isFirst && !isLast;

          const parentStyle = cn(
            "block max-w-40 truncate text-sm text-gray-400",
            isMiddle ? "font-semibold" : "font-normal",
          );

          return (
            <Fragment key={`${item.label}-${index}`}>
              <BreadcrumbItem className={cn("min-w-0", isLast && "flex-1")}>
                {isLast ? (
                  <BreadcrumbPage
                    title={item.label}
                    className="text-sm font-bold"
                  >
                    {truncateLabel(item.label)}
                  </BreadcrumbPage>
                ) : item.href ? (
                  <Link
                    to={item.href}
                    title={item.label}
                    className={cn(
                      "transition-colors hover:text-foreground",
                      parentStyle,
                    )}
                  >
                    {truncateLabel(item.label)}
                  </Link>
                ) : (
                  <span title={item.label} className={parentStyle}>
                    {truncateLabel(item.label)}
                  </span>
                )}
              </BreadcrumbItem>
              {!isLast && (
                <BreadcrumbSeparator
                  className={cn(
                    "shrink-0 [&>svg]:size-4",
                    index === items.length - 2
                      ? "text-gray-500"
                      : "text-gray-400",
                  )}
                />
              )}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );

  // Fallback: no header on this page (e.g. login), so render inline
  if (!slot) return breadcrumb;
  return createPortal(breadcrumb, slot);
};

export default PageBreadcrumb;
