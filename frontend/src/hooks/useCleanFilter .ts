import { useCallback } from 'react';
import type { IFilter } from '@/types/IFilter';

export function useCleanFilter() {
  const cleanFilter = useCallback((filter: IFilter) => {
    const cleaned: Record<string, string> = {};

    for (const key in filter) {
      const value = filter[key as keyof IFilter];
      if (value !== '' && value != null) {
        cleaned[key] = value;
      }
    }

    return cleaned;
  }, []);

  return cleanFilter;
}
