import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from '@/components/ui';
import { mockTasks } from './mock';
import { tasksColumns } from '@/components/columns-bucket';

const Tasks = () => {
  const columns = tasksColumns;

  const table = useReactTable({
    data: mockTasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            View and manage assigned tasks
          </p>
        </div>
        <Button disabled className="w-full sm:w-auto">
          Create New Task
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle>All Tasks</CardTitle>
        </CardHeader>
        <CardContent className="px-2 sm:px-6 pt-0">
          <div className="rounded-md border overflow-x-auto max-w-full">
            <Table className="w-full sm:min-w-[800px]">
              <TableHeader>
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => {
                      const hideOnMobile = header.column.columnDef.meta?.hideOnMobile;
                      return (
                        <TableHead
                          key={header.id}
                          className={`h-10 sm:h-12 px-2 sm:px-4 whitespace-nowrap text-xs sm:text-sm ${hideOnMobile ? 'hidden sm:table-cell' : ''}`}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map(row => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                      {row.getVisibleCells().map(cell => {
                        const hideOnMobile = cell.column.columnDef.meta?.hideOnMobile;
                        return (
                          <TableCell
                            key={cell.id}
                            className={`px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm whitespace-nowrap ${hideOnMobile ? 'hidden sm:table-cell' : ''}`}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={tasksColumns.length} className="h-24 text-center">
                      No tasks found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { Tasks };
