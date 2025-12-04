import { type ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui';
import { createSortableHeader, formatDate, formatCurrency } from './utils';
import type { InsuranceRecord } from '@/pages/future-work/mock';

const getStatusVariant = (status: InsuranceRecord['status']) => {
  switch (status) {
    case 'active':
      return 'success';
    case 'expired':
      return 'destructive';
    case 'pending':
      return 'secondary';
    default:
      return 'default';
  }
};

const formatStatus = (status: InsuranceRecord['status']) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export const insuranceColumns: ColumnDef<InsuranceRecord>[] = [
  {
    accessorKey: 'patientName',
    header: createSortableHeader('Patient Name'),
    cell: ({ row }) => <div className="font-medium">{row.getValue('patientName')}</div>,
  },
  {
    accessorKey: 'insuranceProvider',
    header: createSortableHeader('Insurance Provider'),
    cell: ({ row }) => <div>{row.getValue('insuranceProvider')}</div>,
  },
  {
    accessorKey: 'policyNumber',
    header: createSortableHeader('Policy Number'),
    meta: { hideOnMobile: true },
    cell: ({ row }) => <div className="font-mono text-sm">{row.getValue('policyNumber')}</div>,
  },
  {
    accessorKey: 'groupNumber',
    header: 'Group Number',
    meta: { hideOnMobile: true },
    cell: ({ row }) => {
      const groupNumber = row.getValue('groupNumber') as string | null;
      return <div className="font-mono text-sm">{groupNumber || '-'}</div>;
    },
  },
  {
    accessorKey: 'effectiveDate',
    header: createSortableHeader('Effective Date'),
    meta: { hideOnMobile: true },
    cell: ({ row }) => {
      const date = row.getValue('effectiveDate') as string;
      return <div>{formatDate(date)}</div>;
    },
  },
  {
    accessorKey: 'expirationDate',
    header: 'Expiration Date',
    meta: { hideOnMobile: true },
    cell: ({ row }) => {
      const expirationDate = row.getValue('expirationDate') as string | null;
      if (!expirationDate) return <div className="text-muted-foreground">-</div>;
      return <div>{formatDate(expirationDate)}</div>;
    },
  },
  {
    accessorKey: 'copay',
    header: createSortableHeader('Copay'),
    meta: { hideOnMobile: true },
    cell: ({ row }) => {
      const copay = row.getValue('copay') as number;
      return <div>{formatCurrency(copay)}</div>;
    },
  },
  {
    accessorKey: 'deductible',
    header: createSortableHeader('Deductible'),
    meta: { hideOnMobile: true },
    cell: ({ row }) => {
      const deductible = row.getValue('deductible') as number;
      return <div>{formatCurrency(deductible)}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: createSortableHeader('Status'),
    cell: ({ row }) => {
      const status = row.getValue('status') as InsuranceRecord['status'];
      return <Badge variant={getStatusVariant(status)}>{formatStatus(status)}</Badge>;
    },
  },
];
