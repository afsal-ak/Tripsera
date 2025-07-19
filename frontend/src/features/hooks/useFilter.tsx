// import { useSearchParams } from "react-router-dom";
// import { useCallback, useState } from "react";

// export const useFilters = (initialState = {}) => {
//   const [searchParams, setSearchParams] = useSearchParams();

//   const [filters, setFilters] = useState({
//     query: searchParams.get("query") || "",
//     status: searchParams.get("status") || "",
//     startDate: searchParams.get("startDate") || "",
//     endDate: searchParams.get("endDate") || "",
//     ...initialState,
//   });

//   const updateFilter = useCallback((key: string, value: string) => {
//     const newParams = new URLSearchParams(searchParams);
//     if (value) {
//       newParams.set(key, value);
//     } else {
//       newParams.delete(key);
//     }
//     newParams.set("page", "1"); // reset pagination
//     setSearchParams(newParams);
//     setFilters((prev) => ({ ...prev, [key]: value }));
//   }, [searchParams, setSearchParams]);

//   const clearFilters = () => {
//     const keys = ["query", "status", "startDate", "endDate"];
//     const newParams = new URLSearchParams(searchParams);
//     keys.forEach((key) => newParams.delete(key));
//     newParams.set("page", "1");
//     setSearchParams(newParams);

//     setFilters({
//       query: "",
//       status: "",
//       startDate: "",
//       endDate: "",
//       ...initialState,
//     });
//   };

//   return {
//     filters,
//     updateFilter,
//     clearFilters,
//   };
// };
// // const { filters, updateFilter, clearFilters } = useFilters();

// // <Select value={filters.status} onValueChange={(val) => updateFilter("status", val)}>
// //   <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
// //   <SelectContent>
// //     <SelectItem value="">All</SelectItem>
// //     <SelectItem value="pending">Pending</SelectItem>
// //     <SelectItem value="confirmed">Confirmed</SelectItem>
// //   </SelectContent>
// // </Select>

// // <Input
// //   value={filters.query}
// //   onChange={(e) => updateFilter("query", e.target.value)}
// //   placeholder="Search by title"
// // />

// // <Button onClick={clearFilters}>Clear All</Button>
// useFilters.ts
import { useSearchParams } from "react-router-dom";

export function useFilters(defaults: Record<string, string> = {}) {
  const [params, setParams] = useSearchParams();

  // Build final filter object from URL params + defaults
  const filters = {
    query: params.get("query") || "",
    status: params.get("status") || "all",
    startDate: params.get("startDate") || "",
    endDate: params.get("endDate") || "",
    sort: params.get("sort") || "newest",
    page: params.get("page") || "1",
    ...defaults,
  };

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(params.toString());

    if (value === "" || value === "all") {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }

    newParams.set("page", "1"); // Reset to first page
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
