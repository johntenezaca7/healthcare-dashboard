import { useMemo, useState, useCallback } from 'react';
import { useGetAllPatients } from '@/hooks/queries';
import {
  createColumns,
  PatientTableSkeleton,
  PatientFilters,
  PatientTable,
  PatientTablePagination,
  PatientListHeader,
  ErrorCard,
  EmptyStateCard,
  PaginationDetails,
} from '@/components/patients-list';
import { usePatientFilters } from '@/hooks/patientList';
import { calculateTotalPages } from '@/components/patients-list/utils/pagination';

const DEFAULT_PAGE_SIZE = 25;

const PatientList = () => {
  const [page, setPage] = useState(1);
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

  const {
    data,
    isLoading,
    error,
  } = useGetAllPatients({
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
      setPage(1);
    },
    [handleSearch]
  );

  const handleFilterChangeWithPageReset = useCallback(
    (filter: string, value: Parameters<typeof handleFilterChange>[1]) => {
      handleFilterChange(filter, value);
      setPage(1);
    },
    [handleFilterChange]
  );

  const clearFiltersWithPageReset = useCallback(() => {
    clearFilters();
    setPage(1);
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
