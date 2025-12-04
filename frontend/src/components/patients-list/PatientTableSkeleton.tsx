import { memo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui';
import { Skeleton } from '@/components/ui';

const PatientTableSkeleton = memo(() => {
  return (
    <div className="rounded-md border overflow-x-auto max-w-full">
      <Table className="w-full sm:min-w-[800px]">
        <TableHeader>
          <TableRow>
            <TableHead className="h-10 sm:h-12 px-3 sm:px-4 whitespace-nowrap text-xs sm:text-sm">
              Name
            </TableHead>
            <TableHead className="h-10 sm:h-12 px-3 sm:px-4 whitespace-nowrap text-xs sm:text-sm">
              Age
            </TableHead>
            <TableHead className="hidden sm:table-cell h-10 sm:h-12 px-3 sm:px-4 whitespace-nowrap text-xs sm:text-sm">
              Insurance Provider
            </TableHead>
            <TableHead className="hidden sm:table-cell h-10 sm:h-12 px-3 sm:px-4 whitespace-nowrap text-xs sm:text-sm">
              Phone
            </TableHead>
            <TableHead className="hidden sm:table-cell h-10 sm:h-12 px-3 sm:px-4 whitespace-nowrap text-xs sm:text-sm">
              Last Visit
            </TableHead>
            <TableHead className="hidden sm:table-cell h-10 sm:h-12 px-3 sm:px-4 whitespace-nowrap text-xs sm:text-sm">
              Blood Type
            </TableHead>
            <TableHead className="h-10 sm:h-12 px-3 sm:px-4 whitespace-nowrap text-xs sm:text-sm">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(10)].map((_, i) => (
            <TableRow key={i}>
              <TableCell className="px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-base whitespace-nowrap">
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell className="px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-base whitespace-nowrap">
                <Skeleton className="h-4 w-12" />
              </TableCell>
              <TableCell className="hidden sm:table-cell px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-base whitespace-nowrap">
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell className="hidden sm:table-cell px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-base whitespace-nowrap">
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell className="hidden sm:table-cell px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-base whitespace-nowrap">
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell className="hidden sm:table-cell px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-base whitespace-nowrap">
                <Skeleton className="h-4 w-12" />
              </TableCell>
              <TableCell className="px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-base whitespace-nowrap">
                <Skeleton className="h-5 w-16" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
});

PatientTableSkeleton.displayName = 'PatientTableSkeleton';

export { PatientTableSkeleton };
