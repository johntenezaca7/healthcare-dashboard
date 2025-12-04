import { type ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import { Button, Badge } from '@/components/ui';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { PatientListItem } from '@/types';
import { getPatientData } from '@/components/patients-list/utils';
import { defaultNA } from '@/components/constants';
import { calculateAge, formatDate } from '@/utils/date';
import { formatStatus } from '@/utils/format';
import { getPatientDetailRoute } from '@/utils/constants';

interface CreateColumnsParams {
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  currentSortBy?: string;
  currentSortOrder?: 'asc' | 'desc';
}

export function createColumns({
  onSortChange,
  currentSortBy,
  currentSortOrder,
}: CreateColumnsParams): ColumnDef<PatientListItem>[] {
  return [
    {
      accessorKey: 'name',
      size: 120,
      header: () => {
        const isSorted = currentSortBy === 'firstName' || currentSortBy === 'lastName';
        const sortDir = currentSortOrder;
        return (
          <Button
            variant="ghost"
            onClick={() => {
              const newOrder = isSorted && sortDir === 'asc' ? 'desc' : 'asc';
              onSortChange('firstName', newOrder);
            }}
            className="h-8 px-2 hover:bg-transparent"
          >
            Name
            {isSorted ? (
              sortDir === 'asc' ? (
                <ArrowUp className="ml-2 h-4 w-4" />
              ) : (
                <ArrowDown className="ml-2 h-4 w-4" />
              )
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        const data = getPatientData(row.original);
        return (
          <Link
            to={getPatientDetailRoute(data.id)}
            className="font-medium hover:text-primary hover:underline transition-colors"
          >
            {data.firstName} {data.lastName}
          </Link>
        );
      },
    },
    {
      accessorKey: 'age',
      size: 60,
      header: () => {
        const isSorted = currentSortBy === 'dateOfBirth';
        const sortDir = currentSortOrder;
        return (
          <Button
            variant="ghost"
            onClick={() => {
              const newOrder = isSorted && sortDir === 'asc' ? 'desc' : 'asc';
              onSortChange('dateOfBirth', newOrder);
            }}
            className="h-8 px-2 hover:bg-transparent"
          >
            Age
            {isSorted ? (
              sortDir === 'asc' ? (
                <ArrowUp className="ml-2 h-4 w-4" />
              ) : (
                <ArrowDown className="ml-2 h-4 w-4" />
              )
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        const data = getPatientData(row.original);
        return <div className="whitespace-nowrap">{calculateAge(data.dateOfBirth)}</div>;
      },
    },
    {
      accessorKey: 'insuranceProvider',
      size: 70,
      meta: {
        hideOnMobile: true,
      },
      header: () => {
        const isSorted = currentSortBy === 'insuranceProvider';
        const sortDir = currentSortOrder;
        return (
          <Button
            variant="ghost"
            onClick={() => {
              const newOrder = isSorted && sortDir === 'asc' ? 'desc' : 'asc';
              onSortChange('insuranceProvider', newOrder);
            }}
            className="h-8 px-2 hover:bg-transparent"
          >
            Insurance Provider
            {isSorted ? (
              sortDir === 'asc' ? (
                <ArrowUp className="ml-2 h-4 w-4" />
              ) : (
                <ArrowDown className="ml-2 h-4 w-4" />
              )
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        const data = getPatientData(row.original);
        return <div className="text-muted-foreground">{data.insuranceProvider || defaultNA}</div>;
      },
    },
    {
      accessorKey: 'phone',
      size: 60,
      meta: {
        hideOnMobile: true,
      },
      header: 'Phone',
      cell: ({ row }) => {
        const data = getPatientData(row.original);
        return <div>{data.phone}</div>;
      },
    },
    {
      accessorKey: 'lastVisit',
      size: 55,
      meta: {
        hideOnMobile: true,
      },
      header: 'Last Visit',
      cell: ({ row }) => {
        const data = getPatientData(row.original);
        const lastVisit = data.lastVisit;
        return (
          <div className="text-muted-foreground">{lastVisit ? formatDate(lastVisit) : defaultNA}</div>
        );
      },
    },
    {
      accessorKey: 'bloodType',
      header: 'Blood Type',
      size: 50,
      meta: {
        hideOnMobile: true,
      },
      cell: ({ row }) => {
        const data = getPatientData(row.original);
        const bloodType = data.bloodType;
        return <div>{bloodType || defaultNA}</div>;
      },
    },
    {
      accessorKey: 'status',
      size: 80,
      header: () => {
        const isSorted = currentSortBy === 'status';
        const sortDir = currentSortOrder;
        return (
          <Button
            variant="ghost"
            onClick={() => {
              const newOrder = isSorted && sortDir === 'asc' ? 'desc' : 'asc';
              onSortChange('status', newOrder);
            }}
            className="h-8 px-2 hover:bg-transparent"
          >
            Status
            {isSorted ? (
              sortDir === 'asc' ? (
                <ArrowUp className="ml-2 h-4 w-4" />
              ) : (
                <ArrowDown className="ml-2 h-4 w-4" />
              )
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        const data = getPatientData(row.original);
        const status = data.status || 'active';
        const statusVariant =
          status === 'active' ? 'success' : status === 'critical' ? 'destructive' : 'secondary';
        return <Badge variant={statusVariant}>{formatStatus(status)}</Badge>;
      },
    },
  ];
}

