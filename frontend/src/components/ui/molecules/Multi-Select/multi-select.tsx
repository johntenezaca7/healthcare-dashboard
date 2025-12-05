import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';

import { Button } from '@/components/ui';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui';
import { Checkbox } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui';

import { cn } from '@/styles/utils';

interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder: string;
  className?: string;
}

const MultiSelect = ({ options, selected, onChange, placeholder, className }: MultiSelectProps) => {
  const [open, setOpen] = useState(false);

  const handleToggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const handleRemove = (option: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onChange(selected.filter(item => item !== option));
    setOpen(false);
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onChange([]);
    setOpen(false);
  };

  const buttonElement = (
    <Button
      variant="outline"
      role="combobox"
      aria-expanded={open}
      className={cn(
        'w-full justify-between h-10 px-3 py-2',
        selected.length > 0 && 'border-[#D4C1FF] bg-[#D4C1FF]/10 focus-visible:ring-[#D4C1FF]',
        className
      )}
    >
      <div className="flex flex-wrap gap-1 flex-1 min-w-0 max-h-8 overflow-hidden">
        {selected.length === 0 ? (
          <span className="text-muted-foreground">{placeholder}</span>
        ) : (
          <>
            {selected.slice(0, 2).map(item => (
              <Badge
                key={item}
                variant="secondary"
                className="mr-1 shrink-0"
                onClick={e => {
                  e.stopPropagation();
                  handleRemove(item, e);
                }}
              >
                {item}
                <button
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.stopPropagation();
                      handleRemove(item, e as unknown as React.MouseEvent);
                    }
                  }}
                  onMouseDown={e => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={e => {
                    e.stopPropagation();
                    handleRemove(item, e);
                  }}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            ))}
            {selected.length > 2 && (
              <Badge variant="secondary" className="shrink-0">
                +{selected.length - 2}
              </Badge>
            )}
          </>
        )}
      </div>
      <div className="flex items-center gap-1 shrink-0 ml-2">
        {selected.length > 0 && (
          <X
            className="h-4 w-4 text-muted-foreground hover:text-foreground"
            onClick={e => {
              e.stopPropagation();
              handleClearAll(e);
            }}
          />
        )}
        <ChevronDown className="h-4 w-4 opacity-50" />
      </div>
    </Button>
  );

  return (
    <TooltipProvider>
      <Popover open={open} onOpenChange={setOpen}>
        {selected.length > 0 ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>{buttonElement}</PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <div className="space-y-1">
                <p className="text-xs font-semibold mb-2">Selected ({selected.length}):</p>
                <div className="flex flex-wrap gap-1">
                  {selected.map(item => (
                    <Badge
                      key={item}
                      variant="secondary"
                      className="text-xs cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={e => {
                        e.stopPropagation();
                        handleRemove(item, e);
                      }}
                    >
                      {item}
                      <X className="h-3 w-3 ml-1 inline-block" />
                    </Badge>
                  ))}
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        ) : (
          <PopoverTrigger asChild>{buttonElement}</PopoverTrigger>
        )}
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <div className="max-h-60 overflow-auto p-1">
            {options.map(option => (
              <div
                key={option}
                className="flex items-center space-x-2 rounded-sm px-2 py-1.5 hover:bg-accent cursor-pointer"
                onClick={() => handleToggle(option)}
              >
                <Checkbox
                  checked={selected.includes(option)}
                  onCheckedChange={() => handleToggle(option)}
                />
                <label className="flex-1 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {option}
                </label>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
};

export { MultiSelect };
