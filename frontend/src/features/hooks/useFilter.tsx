import { useSearchParams } from 'react-router-dom';

export function useFilters(defaults: Record<string, string> = {}) {
  const [params, setParams] = useSearchParams();

  // Build final filter object from URL params + defaults
  const filters = {
    query: params.get('query') || '',
    status: params.get('status') || 'all',
    startDate: params.get('startDate') || '',
    endDate: params.get('endDate') || '',
    sort: params.get('sort') || 'newest',
    page: params.get('page') || '1',
    ...defaults,
  };

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(params.toString());

    if (value === '' || value === 'all') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }

    newParams.set('page', '1'); // Reset to first page
    setParams(newParams);
  };

  const clearFilters = () => {
    setParams({});
  };

  return { filters, updateFilter, clearFilters };
}

/*
const { filters, updateFilter, clearFilters } = useFilters();

<Input
  placeholder="Search by name"
  value={filters.query}
  onChange={(e) => updateFilter("query", e.target.value)}
/>

<Select value={filters.status} onValueChange={(val) => updateFilter("status", val)}>
  <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All</SelectItem>
    <SelectItem value="pending">Pending</SelectItem>
    <SelectItem value="confirmed">Confirmed</SelectItem>
    <SelectItem value="cancelled">Cancelled</SelectItem>
  </SelectContent>
</Select>

<div className="flex gap-2">
  <Input
    type="date"
    value={filters.startDate}
    onChange={(e) => updateFilter("startDate", e.target.value)}
  />
  <Input
    type="date"
    value={filters.endDate}
    onChange={(e) => updateFilter("endDate", e.target.value)}
  />
</div>

<Button onClick={clearFilters}>Clear All</Button>





*/
