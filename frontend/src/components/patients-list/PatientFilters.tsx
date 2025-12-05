import { memo } from 'react';
import { X } from 'lucide-react';

import { Button, Card, CardContent, MultiSelect } from '@/components/ui';

import {
  bloodTypes,
  commonAllergies,
  commonConditions,
  commonMedications,
  filter,
  insuranceProviders,
  lastVisitOptions,
  placeholder,
  statusesDisplay,
} from '../constants';
import type { FilterValue } from './utils/types';
import { PatientSearch } from './PatientSearch';
import {
  convertLastVisitApiToDisplay,
  convertLastVisitDisplayToApi,
  convertStatusApiToDisplay,
  convertStatusDisplayToApi,
} from './utils';

interface PatientFiltersProps {
  searchValue: string;
  onSearch: (value: string) => void;
  onClearSearch: () => void;
  onClearAll?: () => void;
  insuranceProvider?: string[];
  allergies?: string[];
  currentMedications?: string[];
  conditions?: string[];
  bloodType?: string[];
  lastVisit?: string[];
  status?: string[];
  onFilterChange: (filter: string, value: FilterValue) => void;
  hasActiveFilters?: boolean;
}

const PatientFilters = memo(
  ({
    searchValue,
    onSearch,
    onClearSearch,
    onClearAll,
    insuranceProvider,
    allergies,
    currentMedications,
    conditions,
    bloodType,
    lastVisit,
    status,
    onFilterChange,
    hasActiveFilters = false,
  }: PatientFiltersProps) => {
    const handleClearAll = () => {
      if (onClearAll) {
        onClearAll();
      } else {
        Object.values(filter).forEach(filterKey => {
          onFilterChange(filterKey, undefined);
        });
        onClearSearch();
      }
    };

    return (
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-foreground">Filters</h3>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={handleClearAll} className="h-8 text-xs">
                <X className="h-3 w-3 mr-1.5" />
                Clear All
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4">
            <MultiSelect
              options={insuranceProviders}
              selected={insuranceProvider || []}
              onChange={selected =>
                onFilterChange(filter.InsuranceProvider, selected.length > 0 ? selected : undefined)
              }
              placeholder={placeholder.Insurance}
            />
            <MultiSelect
              options={commonAllergies}
              selected={allergies || []}
              onChange={selected =>
                onFilterChange(filter.Allergies, selected.length > 0 ? selected : undefined)
              }
              placeholder={placeholder.Allergies}
            />
            <MultiSelect
              options={commonMedications}
              selected={currentMedications || []}
              onChange={selected =>
                onFilterChange(
                  filter.CurrentMedications,
                  selected.length > 0 ? selected : undefined
                )
              }
              placeholder={placeholder.Medications}
            />
            <MultiSelect
              options={commonConditions}
              selected={conditions || []}
              onChange={selected =>
                onFilterChange(filter.Conditions, selected.length > 0 ? selected : undefined)
              }
              placeholder={placeholder.Conditions}
            />
            <MultiSelect
              options={bloodTypes}
              selected={bloodType || []}
              onChange={selected =>
                onFilterChange(filter.BloodType, selected.length > 0 ? selected : undefined)
              }
              placeholder={placeholder.BloodType}
            />
            <MultiSelect
              options={lastVisitOptions}
              selected={convertLastVisitApiToDisplay(lastVisit || [])}
              onChange={selected => {
                const values = convertLastVisitDisplayToApi(selected);
                onFilterChange(filter.LastVisit, values.length > 0 ? values : undefined);
              }}
              placeholder={placeholder.LastVisit}
            />
            <MultiSelect
              options={statusesDisplay}
              selected={convertStatusApiToDisplay(status || [])}
              onChange={selected => {
                const values = convertStatusDisplayToApi(selected);
                onFilterChange(filter.Status, values.length > 0 ? values : undefined);
              }}
              placeholder={placeholder.Status}
            />
          </div>

          <PatientSearch searchValue={searchValue} onSearch={onSearch} onClear={onClearSearch} />
        </CardContent>
      </Card>
    );
  }
);

PatientFilters.displayName = 'PatientFilters';

export { PatientFilters };
