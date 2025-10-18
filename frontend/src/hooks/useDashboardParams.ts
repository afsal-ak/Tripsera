import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import type { IDateFilter, DateFilter } from '@/types/IDashboard';

export function useDashboardParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  //  Extract filter values
  const filter = (searchParams.get('filter') || 'this_month') as DateFilter;
  const startDate = searchParams.get('startDate') || undefined;
  const endDate = searchParams.get('endDate') || undefined;

  //  Memoize params to avoid unnecessary re-renders
  const params: IDateFilter = useMemo(
    () => ({ filter, startDate, endDate }),
    [filter, startDate, endDate]
  );

  //  Update URL params only if something actually changed
  const updateParams = (newParams: IDateFilter) => {
    const updated = new URLSearchParams();
    updated.set('filter', newParams.filter || 'this_month');

    if (newParams.filter === 'custom' && newParams.startDate && newParams.endDate) {
      updated.set('startDate', newParams.startDate);
      updated.set('endDate', newParams.endDate);
    }

    //  Update only if values are different
    if (updated.toString() !== searchParams.toString()) {
      setSearchParams(updated);
    }
  };

  return { params, updateParams };
}
