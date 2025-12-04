import { memo } from 'react';

interface PaginationDetailsProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  itemLabel?: string;
}

export const PaginationDetails = memo(
  ({ page, pageSize, total, totalPages, itemLabel = 'items' }: PaginationDetailsProps) => {
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, total);

    return (
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm text-muted-foreground">
        <div className="text-center sm:text-left">
          Showing {start} to {end} of {total} {itemLabel}
        </div>
        <div className="text-center sm:text-right">
          Page {page} of {totalPages || 1}
        </div>
      </div>
    );
  }
);

PaginationDetails.displayName = 'PaginationDetails';

