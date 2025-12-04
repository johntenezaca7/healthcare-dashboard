import { type ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui';
import { createSortableHeader, formatDate } from './utils';
import type { LabResult } from '@/pages/future-work/mock';

const getStatusVariant = (status: LabResult['status']) => {
  switch (status) {
    case 'pending':
      return 'secondary';
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'destructive';
    default:
      return 'default';
  }
};

const formatStatus = (status: LabResult['status']) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export const labsResultsColumns: ColumnDef<LabResult>[] = [
  {
    accessorKey: 'patientName',
    header: createSortableHeader('Patient Name'),
    cell: ({ row }) => <div className="font-medium">{row.getValue('patientName')}</div>,
  },
  {
    accessorKey: 'testName',
    header: createSortableHeader('Test Name'),
    cell: ({ row }) => <div className="font-medium">{row.getValue('testName')}</div>,
  },
  {
    accessorKey: 'orderDate',
    header: createSortableHeader('Order Date'),
    meta: { hideOnMobile: true },
    cell: ({ row }) => {
      const date = row.getValue('orderDate') as string;
      return <div>{formatDate(date)}</div>;
    },
  },
  {
    accessorKey: 'resultDate',
    header: 'Result Date',
    meta: { hideOnMobile: true },
    cell: ({ row }) => {
      const resultDate = row.getValue('resultDate') as string | null;
      if (!resultDate) return <div className="text-muted-foreground">-</div>;
      return <div>{formatDate(resultDate)}</div>;
    },
  },
  {
    accessorKey: 'orderedBy',
    header: createSortableHeader('Ordered By'),
    meta: { hideOnMobile: true },
    cell: ({ row }) => <div>{row.getValue('orderedBy')}</div>,
  },
  {
    accessorKey: 'status',
    header: createSortableHeader('Status'),
    cell: ({ row }) => {
      const status = row.getValue('status') as LabResult['status'];
      return <Badge variant={getStatusVariant(status)}>{formatStatus(status)}</Badge>;
    },
  },
  {
    accessorKey: 'result',
    header: 'Result',
    meta: { hideOnMobile: true },
    cell: ({ row }) => {
      const result = row.getValue('result') as string | null;
      if (!result) return <div className="text-muted-foreground">-</div>;
      return <div>{result}</div>;
    },
  },
];
