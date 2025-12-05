import { memo, useMemo } from 'react';
import {
  type ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui';

import { PatientListItem } from '@/types';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    hideOnMobile?: boolean;
  }
}

interface PatientTableProps {
  data: PatientListItem[];
  columns: ColumnDef<PatientListItem>[];
}

const PatientTable = memo(({ data, columns }: PatientTableProps) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    manualPagination: true,
  });

  const rowModel = useMemo(() => table.getRowModel(), [table]);
  const headerGroups = useMemo(() => table.getHeaderGroups(), [table]);

  return (
    <div className="rounded-md border overflow-x-auto max-w-full">
      <Table className="w-full sm:min-w-[800px]">
        <TableHeader>
          {headerGroups.map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                const columnSize = header.column.columnDef.size;
                const hideOnMobile = header.column.columnDef.meta?.hideOnMobile;
                return (
                  <TableHead
                    key={header.id}
                    className={`h-10 sm:h-12 px-3 sm:px-4 whitespace-nowrap text-xs sm:text-sm ${hideOnMobile ? 'hidden sm:table-cell' : ''}`}
                    style={columnSize ? { width: columnSize, minWidth: columnSize } : undefined}
                  >
                    {header.isPlaceholder
                      ? null
                      : header.column.columnDef.header &&
                          typeof header.column.columnDef.header === 'function'
                        ? header.column.columnDef.header(header.getContext())
                        : header.column.columnDef.header}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {rowModel.rows?.length ? (
            rowModel.rows.map(row => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className="hover:bg-muted/50"
              >
                {row.getVisibleCells().map(cell => {
                  const columnSize = cell.column.columnDef.size;
                  const hideOnMobile = cell.column.columnDef.meta?.hideOnMobile;
                  return (
                    <TableCell
                      key={cell.id}
                      className={`px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm whitespace-nowrap ${hideOnMobile ? 'hidden sm:table-cell' : ''}`}
                      style={columnSize ? { width: columnSize, minWidth: columnSize } : undefined}
                    >
                      {typeof cell.column.columnDef.cell === 'function'
                        ? cell.column.columnDef.cell(cell.getContext())
                        : (cell.getValue() as React.ReactNode)}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
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
});

PatientTable.displayName = 'PatientTable';

export { PatientTable };
