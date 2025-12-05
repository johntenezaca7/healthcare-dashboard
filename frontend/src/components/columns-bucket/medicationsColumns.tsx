import { type ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui';

import { createSortableHeader, formatDate } from './utils';

import type { Medication } from '@/pages/future-work/mock';

const getStatusVariant = (status: Medication['status']) => {
  switch (status) {
    case 'active':
      return 'success';
    case 'completed':
      return 'default';
    case 'discontinued':
      return 'destructive';
    default:
      return 'default';
  }
};

const formatStatus = (status: Medication['status']) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export const medicationsColumns: ColumnDef<Medication>[] = [
  {
    accessorKey: 'patientName',
    header: createSortableHeader('Patient Name'),
    cell: ({ row }) => <div className="font-medium">{row.getValue('patientName')}</div>,
  },
  {
    accessorKey: 'medicationName',
    header: createSortableHeader('Medication'),
    cell: ({ row }) => <div className="font-medium">{row.getValue('medicationName')}</div>,
  },
  {
    accessorKey: 'dosage',
    header: 'Dosage',
    meta: { hideOnMobile: true },
    cell: ({ row }) => <div>{row.getValue('dosage')}</div>,
  },
  {
    accessorKey: 'frequency',
    header: 'Frequency',
    meta: { hideOnMobile: true },
    cell: ({ row }) => <div>{row.getValue('frequency')}</div>,
  },
  {
    accessorKey: 'prescribedBy',
    header: createSortableHeader('Prescribed By'),
    meta: { hideOnMobile: true },
    cell: ({ row }) => <div>{row.getValue('prescribedBy')}</div>,
  },
  {
    accessorKey: 'startDate',
    header: createSortableHeader('Start Date'),
    meta: { hideOnMobile: true },
    cell: ({ row }) => {
      const date = row.getValue('startDate') as string;
      return <div>{formatDate(date)}</div>;
    },
  },
  {
    accessorKey: 'endDate',
    header: 'End Date',
    meta: { hideOnMobile: true },
    cell: ({ row }) => {
      const endDate = row.getValue('endDate') as string | null;
      if (!endDate) return <div className="text-muted-foreground">-</div>;
      return <div>{formatDate(endDate)}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: createSortableHeader('Status'),
    cell: ({ row }) => {
      const status = row.getValue('status') as Medication['status'];
      return <Badge variant={getStatusVariant(status)}>{formatStatus(status)}</Badge>;
    },
  },
];
