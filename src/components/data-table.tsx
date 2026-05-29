"use client";

import { flexRender, type Table as TableType } from "@tanstack/react-table";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DataTableProps<TData> {
  table: TableType<TData>;
  isLoading?: boolean;
}

function SortHeader({ column, children }: { column: any; children: React.ReactNode }) {
  const isSorted = column.getIsSorted();
  const Icon = isSorted === "asc" ? ChevronUp : isSorted === "desc" ? ChevronDown : ChevronsUpDown;

  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 data-[state=open]:bg-accent"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {children}
      <Icon className={cn("ml-2 h-4 w-4", !isSorted && "opacity-30")} />
    </Button>
  );
}

function LoadingRows({ rows, cols }: { rows: number; cols: number }) {
  return Array.from({ length: rows }).map((_, i) => (
    <TableRow key={i}>
      {Array.from({ length: cols }).map((_, j) => (
        <TableCell key={j}>
          <div className="h-4 animate-pulse rounded bg-muted" />
        </TableCell>
      ))}
    </TableRow>
  ));
}

export function DataTable<TData>({ table, isLoading }: DataTableProps<TData>) {
  const columns = table.getAllColumns();

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : header.column.getCanSort()
                      ? (
                        <SortHeader column={header.column}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </SortHeader>
                      )
                      : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading
            ? <LoadingRows rows={5} cols={columns.length} />
            : table.getRowModel().rows.length
              ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )
              : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
        </TableBody>
      </Table>
    </div>
  );
}
