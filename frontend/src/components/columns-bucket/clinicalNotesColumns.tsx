import { type ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui';
import { createSortableHeader, formatDate } from './utils';
import type { ClinicalNote } from '@/pages/future-work/mock';

const getStatusVariant = (status: ClinicalNote['status']) => {
  switch (status) {
    case 'draft':
      return 'secondary';
    case 'finalized':
      return 'default';
    case 'signed':
      return 'success';
    default:
      return 'default';
  }
};

const formatStatus = (status: ClinicalNote['status']) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export const clinicalNotesColumns: ColumnDef<ClinicalNote>[] = [
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
    accessorKey: 'provider',
    header: createSortableHeader('Provider'),
    meta: { hideOnMobile: true },
    cell: ({ row }) => <div>{row.getValue('provider')}</div>,
  },
  {
    accessorKey: 'noteType',
    header: 'Note Type',
    meta: { hideOnMobile: true },
    cell: ({ row }) => <div>{row.getValue('noteType')}</div>,
  },
  {
    accessorKey: 'chiefComplaint',
    header: 'Chief Complaint',
    meta: { hideOnMobile: true },
    cell: ({ row }) => <div className="max-w-xs truncate">{row.getValue('chiefComplaint')}</div>,
  },
  {
    accessorKey: 'status',
    header: createSortableHeader('Status'),
    cell: ({ row }) => {
      const status = row.getValue('status') as ClinicalNote['status'];
      return <Badge variant={getStatusVariant(status)}>{formatStatus(status)}</Badge>;
    },
  },
];
