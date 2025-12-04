import { useState, useEffect, memo } from 'react';
import { Input, Button } from '@/components/ui';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/hooks/util';

interface PatientSearchProps {
  searchValue: string;
  onSearch: (value: string) => void;
  onClear: () => void;
}

const PatientSearch = memo(({ searchValue, onSearch, onClear }: PatientSearchProps) => {
  const [inputValue, setInputValue] = useState(searchValue);

  useEffect(() => {
    setInputValue(searchValue);
  }, [searchValue]);

  const debouncedSearch = useDebounce((value: string) => {
    onSearch(value);
  }, 500);

  useEffect(() => {
    if (inputValue === '') {
      onSearch('');
      return;
    }

    debouncedSearch(inputValue);
  }, [inputValue, debouncedSearch, onSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleClear = () => {
    setInputValue('');
    onClear();
  };

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or phone..."
          value={inputValue}
          onChange={handleInputChange}
          className="pl-9 text-sm sm:text-base"
        />
      </div>
      {inputValue && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleClear}
          aria-label="Clear search"
          className="shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
});

PatientSearch.displayName = 'PatientSearch';

export { PatientSearch };
