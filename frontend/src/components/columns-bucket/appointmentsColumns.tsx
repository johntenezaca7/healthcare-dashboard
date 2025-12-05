import { type ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui';

import { createSortableHeader, formatDate } from './utils';

import type { Appointment } from '@/pages/future-work/mock';

const getStatusVariant = (status: Appointment['status']) => {
  switch (status) {
    case 'scheduled':
      return 'default';
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'destructive';
    case 'no-show':
      return 'secondary';
    default:
      return 'default';
  }
};

const formatStatus = (status: Appointment['status']) => {
  return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
};

export const appointmentsColumns: ColumnDef<Appointment>[] = [
  {
    accessorKey: 'patientName',
    header: createSortableHeader('Patient Name'),
    cell: ({ row }) => <div className="font-medium">{row.getValue('patientName')}</div>,
  },
  {
    accessorKey: 'date',
    header: createSortableHeader('Date'),
    cell: ({ row }) => {
      const date = row.getValue('date') as string;
      return <div>{formatDate(date)}</div>;
    },
  },
  {
    accessorKey: 'time',
    header: 'Time',
    meta: { hideOnMobile: true },
    cell: ({ row }) => <div>{row.getValue('time')}</div>,
  },
  {
    accessorKey: 'provider',
    header: createSortableHeader('Provider'),
    meta: { hideOnMobile: true },
    cell: ({ row }) => <div>{row.getValue('provider')}</div>,
  },
  {
    accessorKey: 'type',
    header: 'Type',
    meta: { hideOnMobile: true },
    cell: ({ row }) => <div>{row.getValue('type')}</div>,
  },
  {
    accessorKey: 'status',
    header: createSortableHeader('Status'),
    cell: ({ row }) => {
      const status = row.getValue('status') as Appointment['status'];
      return <Badge variant={getStatusVariant(status)}>{formatStatus(status)}</Badge>;
    },
  },
  {
    accessorKey: 'notes',
    header: 'Notes',
    meta: { hideOnMobile: true },
    cell: ({ row }) => {
      const notes = row.getValue('notes') as string | undefined;
      return <div className="text-muted-foreground">{notes || '-'}</div>;
    },
  },
];
