import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { PaginationProps } from "./TablePagination";
import TablePagination from "./TablePagination";
import { Skeleton } from "@/components/ui/skeleton";

export interface Column<T> {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  pagination?: PaginationProps;
  emptyMessage?: string;
  loading?: boolean;
  fetching?: boolean;
  skeletonRows?: number;
}

function DataTable<T>({
  columns,
  data,
  rowKey,
  pagination,
  emptyMessage = "No data found",
  loading = false,
  fetching = false,
  skeletonRows = 3,
}: DataTableProps<T>) {
  return (
    <div className="flex min-h-0 flex-col">
      <div className="min-h-0 overflow-auto rounded-lg border border-gray-200 bg-white **:data-[slot=table-container]:overflow-visible">
        <Table className="min-w-250">
          <TableHeader className="sticky top-0 z-10 bg-slate-50">
            <TableRow className="hover:bg-slate-50">
              {columns.map((col, index) => (
                <TableHead
                  key={col.key}
                  className={cn(
                    "h-11 text-xs font-normal text-[#6E8295]",
                    index === 0 && "pl-6",
                    col.headerClassName,
                  )}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody
            className={cn(
              fetching &&
                !loading &&
                "pointer-events-none opacity-60 transition-opacity",
            )}
          >
            {loading ? (
              Array.from({ length: skeletonRows }).map((_, i) => (
                <TableRow
                  key={`skeleton-${i}`}
                  className="h-19.5 hover:bg-transparent"
                >
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      <Skeleton className="h-4 w-3/4" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-slate-500"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={rowKey(row)} className="h-19.5">
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      {col.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {pagination && (
        <div className="shrink-0">
          <TablePagination {...pagination} />
        </div>
      )}
    </div>
  );
}

export default DataTable;
