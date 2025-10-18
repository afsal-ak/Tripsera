import React from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/ui/Input';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/Select';

interface Option {
  value: string;
  label: string;
}

interface FilterBarProps {
  searchValue: string;
  statusValue: string;
  startDateValue: string;
  endDateValue: string;
  sortValue: string;
  ratingValue: string;
  customFilterValue: string;
  customLabel?: string;

  onSearchChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onStartDateChange: (val: string) => void;
  onEndDateChange: (val: string) => void;
  onSortChange: (val: string) => void;
  onRatingChange: (val: string) => void;
  onCustomFilterChange: (val: string) => void;

  onClear: () => void;
  onApply: () => void;

  statusOptions: Option[];
  sortOptions: Option[];
  ratingOptions: Option[];
  customOption: Option[];
}

export const FilterBar: React.FC<Partial<FilterBarProps>> = ({
  searchValue,
  statusValue,
  startDateValue,
  endDateValue,
  sortValue,
  ratingValue,
  customFilterValue,
  customLabel = 'Sort By',

  onSearchChange,
  onStatusChange,
  onStartDateChange,
  onEndDateChange,
  onSortChange,
  onRatingChange,
  onCustomFilterChange,

  onClear,
  onApply,

  statusOptions,
  sortOptions,
  ratingOptions,
  customOption,
}) => {
  return (
    <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-lg mb-4">
      {/* Search */}
      {onSearchChange && (
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700" htmlFor="searchInput">
            Search
          </label>
          <Input
            id="searchInput"
            placeholder="Search..."
            value={searchValue ?? ''}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-48"
          />
        </div>
      )}

      {/* Status */}
      {onStatusChange && statusOptions && (
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700" htmlFor="statusSelect">
            Status
          </label>
          <Select value={statusValue ?? ''} onValueChange={onStatusChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Start Date */}
      {onStartDateChange && (
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700" htmlFor="startDateInput">
            Start Date
          </label>
          <input
            id="startDateInput"
            type="date"
            value={startDateValue ?? ''}
            onChange={(e) => onStartDateChange?.(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
      )}

      {/* End Date */}
      {onEndDateChange && (
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700" htmlFor="endDateInput">
            End Date
          </label>
          <input
            id="endDateInput"
            type="date"
            value={endDateValue ?? ''}
            onChange={(e) => onEndDateChange?.(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
      )}

      {/* Sort */}
      {onSortChange && sortOptions && (
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700" htmlFor="sortSelect">
            Sort By
          </label>
          <Select value={sortValue ?? ''} onValueChange={onSortChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      {/* Sort */}
      {onCustomFilterChange && customOption && (
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700" htmlFor="sortSelect">
            {customLabel}
          </label>
          <Select value={customFilterValue ?? ''} onValueChange={onCustomFilterChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by Type" />
            </SelectTrigger>
            <SelectContent>
              {customOption?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Rating */}
      {onRatingChange && ratingOptions && (
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700" htmlFor="ratingSelect">
            Rating
          </label>
          <Select value={ratingValue ?? ''} onValueChange={onRatingChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by Rating..." />
            </SelectTrigger>
            <SelectContent>
              {ratingOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Actions */}
      {(onApply || onClear) && (
        <div className="flex gap-2 pt-8">
          {onApply && (
            <Button variant="default" onClick={onApply}>
              Apply
            </Button>
          )}
          {onClear && (
            <Button variant="outline" onClick={onClear}>
              Clear
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
