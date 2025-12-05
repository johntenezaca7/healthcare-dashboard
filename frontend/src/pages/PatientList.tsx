import { useCallback, useMemo, useState } from 'react';

import {
  createColumns,
  EmptyStateCard,
  ErrorCard,
  PaginationDetails,
  PatientFilters,
  PatientListHeader,
  PatientTable,
  PatientTablePagination,
  PatientTableSkeleton,
} from '@/components/patients-list';
import { calculateTotalPages } from '@/components/patients-list/utils/pagination';

import { usePatientFilters } from '@/hooks/patientList';
import { useGetAllPatients } from '@/hooks/queries';

const DEFAULT_PAGE_SIZE = 25;
const DEFAULT_PAGE = 1;

const PatientList = () => {
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);

  const {
    filters,
    rawFilters,
    normalizedFilters,
    activeFilters,
    searchInput,
    handleSearch,
    handleFilterChange,
    handleSortChange,
    clearFilters,
  } = usePatientFilters();

  const { data, isLoading, error } = useGetAllPatients({
    page,
    pageSize,
    ...filters,
  });

  const patients = data?.items || [];
  const total = data?.total || 0;
  const totalPages = calculateTotalPages(data, total, pageSize);

  const columns = useMemo(
    () =>
      createColumns({
        onSortChange: handleSortChange,
        currentSortBy: rawFilters.sortBy,
        currentSortOrder: rawFilters.sortOrder,
      }),
    [handleSortChange, rawFilters.sortBy, rawFilters.sortOrder]
  );

  const handleSearchWithPageReset = useCallback(
    (value: string) => {
      handleSearch(value);
      setPage(DEFAULT_PAGE);
    },
    [handleSearch]
  );

  const handleFilterChangeWithPageReset = useCallback(
    (filter: string, value: Parameters<typeof handleFilterChange>[1]) => {
      handleFilterChange(filter, value);
      setPage(DEFAULT_PAGE);
    },
    [handleFilterChange]
  );

  const clearFiltersWithPageReset = useCallback(() => {
    clearFilters();
    setPage(DEFAULT_PAGE);
  }, [clearFilters]);

  return (
    <div className="space-y-6">
      <PatientListHeader total={total} />
      <PaginationDetails page={page} pageSize={pageSize} total={total} totalPages={totalPages} />
      <PatientFilters
        searchValue={searchInput}
        onSearch={handleSearchWithPageReset}
        onClearSearch={clearFiltersWithPageReset}
        onClearAll={clearFiltersWithPageReset}
        insuranceProvider={normalizedFilters.insuranceProvider}
        allergies={normalizedFilters.allergies}
        currentMedications={normalizedFilters.currentMedications}
        conditions={normalizedFilters.conditions}
        bloodType={normalizedFilters.bloodType}
        lastVisit={normalizedFilters.lastVisit}
        status={normalizedFilters.status}
        onFilterChange={handleFilterChangeWithPageReset}
        hasActiveFilters={activeFilters}
      />

      <ErrorCard error={error} />

      {isLoading ? (
        <PatientTableSkeleton />
      ) : patients.length === 0 ? (
        <EmptyStateCard hasActiveFilters={activeFilters} />
      ) : (
        <>
          <PatientTable data={patients} columns={columns} />
          <PatientTablePagination
            page={page}
            pageSize={pageSize}
            total={total}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
};

export { PatientList };
