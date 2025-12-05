import { type ColumnDef } from '@tanstack/react-table';
import { CheckCircle2 } from 'lucide-react';

import { Badge, Button } from '@/components/ui';

import { createSortableHeader, formatDate } from './utils';

import type { Task } from '@/pages/future-work/mock';

const getPriorityVariant = (priority: Task['priority']) => {
  switch (priority) {
    case 'high':
      return 'destructive';
    case 'medium':
      return 'default';
    case 'low':
      return 'secondary';
    default:
      return 'default';
  }
};

const getStatusVariant = (status: Task['status']) => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'in-progress':
      return 'default';
    case 'pending':
      return 'secondary';
    case 'overdue':
      return 'destructive';
    default:
      return 'default';
  }
};

const formatPriority = (priority: Task['priority']) => {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
};

const formatStatus = (status: Task['status']) => {
  return status
    .split('-')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const tasksColumns: ColumnDef<Task>[] = [
  {
    accessorKey: 'title',
    header: createSortableHeader('Title'),
    cell: ({ row }) => <div className="font-medium">{row.getValue('title')}</div>,
  },
  {
    accessorKey: 'description',
    header: 'Description',
    meta: { hideOnMobile: true },
    cell: ({ row }) => (
      <div className="max-w-xs truncate text-sm text-muted-foreground">
        {row.getValue('description')}
      </div>
    ),
  },
  {
    accessorKey: 'assignedTo',
    header: createSortableHeader('Assigned To'),
    meta: { hideOnMobile: true },
    cell: ({ row }) => <div>{row.getValue('assignedTo')}</div>,
  },
  {
    accessorKey: 'priority',
    header: createSortableHeader('Priority'),
    meta: { hideOnMobile: true },
    cell: ({ row }) => {
      const priority = row.getValue('priority') as Task['priority'];
      return <Badge variant={getPriorityVariant(priority)}>{formatPriority(priority)}</Badge>;
    },
  },
  {
    accessorKey: 'status',
    header: createSortableHeader('Status'),
    cell: ({ row }) => {
      const status = row.getValue('status') as Task['status'];
      return <Badge variant={getStatusVariant(status)}>{formatStatus(status)}</Badge>;
    },
  },
  {
    accessorKey: 'dueDate',
    header: createSortableHeader('Due Date'),
    cell: ({ row }) => {
      const dueDate = row.getValue('dueDate') as string;
      return <div>{formatDate(dueDate)}</div>;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    meta: { hideOnMobile: true },
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div className="flex items-center gap-2">
          {status !== 'completed' && (
            <Button variant="ghost" size="sm" className="h-8">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Complete
            </Button>
          )}
          {status === 'completed' && (
            <div className="flex items-center text-success">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Done
            </div>
          )}
        </div>
      );
    },
  },
];
