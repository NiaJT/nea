import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}

const linkClass =
  "h-10 cursor-pointer gap-2 rounded-lg bg-white border border-gray-200 bg-white px-4 text-sm text-gray-600 font-normal cursor-pointer";
const disabledClass = "pointer-events-none opacity-50";

const TablePagination = ({
  page,
  pageSize,
  total,
  onPageChange,
  itemLabel = "Items",
}: PaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  const go = (target: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    onPageChange(target);
  };

  return (
    <div className="flex items-center justify-between px-1 pt-6">
      <p className="text-sm text-gray-600">
        Showing{" "}
        <span className="font-semibold text-black">
          {start} - {end}
        </span>{" "}
        of <span className="font-semibold text-black">{total}</span> {itemLabel}
      </p>

      <Pagination className="mx-0 w-auto">
        <PaginationContent className="gap-3">
          <PaginationItem>
            <PaginationLink
              size="default"
              aria-label="Go to previous page"
              aria-disabled={isFirst}
              tabIndex={isFirst ? -1 : undefined}
              onClick={go(page - 1)}
              className={cn(linkClass, isFirst && disabledClass)}
            >
              <FiArrowLeft size={14} /> Previous
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationLink
              size="default"
              aria-label="Go to next page"
              aria-disabled={isLast}
              tabIndex={isLast ? -1 : undefined}
              onClick={go(page + 1)}
              className={cn(linkClass, isLast && disabledClass)}
            >
              Next <FiArrowRight size={14} />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default TablePagination;
