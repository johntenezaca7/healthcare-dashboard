import { type ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui';
import { createSortableHeader, formatDate, formatDateTime } from './utils';
import type { User } from '@/pages/future-work/mock';

const getStatusVariant = (status: User['status']) => {
  switch (status) {
    case 'active':
      return 'success';
    case 'inactive':
      return 'secondary';
    case 'suspended':
      return 'destructive';
    default:
      return 'default';
  }
};

const formatStatus = (status: User['status']) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const formatRole = (role: string) => {
  return role
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const usersColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: createSortableHeader('Name'),
    cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'email',
    header: createSortableHeader('Email'),
    meta: { hideOnMobile: true },
    cell: ({ row }) => <div className="text-sm">{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'role',
    header: createSortableHeader('Role'),
    meta: { hideOnMobile: true },
    cell: ({ row }) => {
      const role = row.getValue('role') as string;
      return <div>{formatRole(role)}</div>;
    },
  },
  {
    accessorKey: 'department',
    header: createSortableHeader('Department'),
    meta: { hideOnMobile: true },
    cell: ({ row }) => {
      const department = row.getValue('department') as string | null;
      return <div>{department || '-'}</div>;
    },
  },
  {
    accessorKey: 'lastLogin',
    header: createSortableHeader('Last Login'),
    meta: { hideOnMobile: true },
    cell: ({ row }) => {
      const lastLogin = row.getValue('lastLogin') as string | null;
      return <div className="text-sm">{formatDateTime(lastLogin)}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: createSortableHeader('Status'),
    cell: ({ row }) => {
      const status = row.getValue('status') as User['status'];
      return <Badge variant={getStatusVariant(status)}>{formatStatus(status)}</Badge>;
    },
  },
  {
    accessorKey: 'createdAt',
    header: createSortableHeader('Created At'),
    meta: { hideOnMobile: true },
    cell: ({ row }) => {
      const createdAt = row.getValue('createdAt') as string;
      return <div className="text-sm">{formatDate(createdAt)}</div>;
    },
  },
];
