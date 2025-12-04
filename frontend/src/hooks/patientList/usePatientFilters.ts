import { useState, useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { omitEmpty } from '@/utils/object';
import { normalizeFilterValues, hasActiveFilters } from '@/components/patients-list/utils';
import type { FetchPatientsParams } from '@/hooks/queries';
import type { FilterValue } from '@/components/patients-list/utils/types';

const DEFAULT_SORT_BY: FetchPatientsParams['sortBy'] = 'createdAt';
const DEFAULT_SORT_ORDER: FetchPatientsParams['sortOrder'] = 'desc';

const DEFAULT_FILTERS: Partial<FetchPatientsParams> = {
  sortBy: DEFAULT_SORT_BY,
  sortOrder: DEFAULT_SORT_ORDER,
};

export function usePatientFilters() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<Partial<FetchPatientsParams>>(DEFAULT_FILTERS);
  const [searchInput, setSearchInput] = useState('');

  const cleanFilters = useMemo(() => omitEmpty(filters), [filters]);
  const normalizedFilters = useMemo(() => normalizeFilterValues(filters), [filters]);
  const activeFilters = useMemo(
    () => hasActiveFilters(filters, searchInput),
    [filters, searchInput]
  );

  const handleSearch = useCallback((value: string) => {
    setSearchInput(value);
    setFilters(prev => {
      const newFilters = { ...prev };
      if (!value || value.trim() === '') {
        delete newFilters.search;
      } else {
        newFilters.search = value;
      }
      return newFilters;
    });
  }, []);

  const handleFilterChange = useCallback((filter: string, value: FilterValue) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      if (value === undefined || (Array.isArray(value) && value.length === 0)) {
        delete newFilters[filter as keyof typeof newFilters];
      } else {
        (newFilters as Record<string, unknown>)[filter] = value;
      }
      return newFilters;
    });
  }, []);

  const handleSortChange = useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
    setFilters(prev => ({
      ...prev,
      sortBy: sortBy as FetchPatientsParams['sortBy'],
      sortOrder,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setSearchInput('');
    setFilters(DEFAULT_FILTERS);
    queryClient.removeQueries({ queryKey: ['patients'] });
  }, [queryClient]);

  return {
    filters: cleanFilters,
    rawFilters: filters,
    normalizedFilters,
    activeFilters,
    searchInput,
    handleSearch,
    handleFilterChange,
    handleSortChange,
    clearFilters,
  };
}

