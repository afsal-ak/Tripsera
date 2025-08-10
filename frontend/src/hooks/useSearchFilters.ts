// import { useSearchParams } from 'react-router-dom';
// import { useState, useEffect } from 'react';

 

// export function useSearchFilters() {
//   const [searchParams, setSearchParams] = useSearchParams();

//   // State for filters
//   const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
//   const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
//   const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
//   const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');
//   const [sort, setSort] = useState(searchParams.get('sort') || '');

//   // Function to apply filters to URL
//   const applyFilters = () => {
//     const params = new URLSearchParams(searchParams);

//     if (searchQuery) {
//       params.set('search', searchQuery);
//     } else {
//       params.delete('search');
//     }

//     if (statusFilter) {
//       params.set('status', statusFilter);
//     } else {
//       params.delete('status');
//     }

//     if (startDate) {
//       params.set('startDate', startDate);
//     } else {
//       params.delete('startDate');
//     }

//     if (endDate) {
//       params.set('endDate', endDate);
//     } else {
//       params.delete('endDate');
//     }
//  if (sort) {
//       params.set('sort', sort);
//     } else {
//       params.delete('sort');
//     }

//     params.set('page', '1'); // Reset to first page when filters change
//     setSearchParams(params);
//   };

//   // Keep state in sync if URL changes externally
//   useEffect(() => {
//     setSearchQuery(searchParams.get('search') || '');
//     setStatusFilter(searchParams.get('status') || '');
//     setStartDate(searchParams.get('startDate') || '');
//     setEndDate(searchParams.get('endDate') || '');
//     setSort(searchParams.get('sort') || '');
//   }, [searchParams, 'search']);

//   return {
//     searchQuery,
//     setSearchQuery,
//     statusFilter,
//     setStatusFilter,
//     startDate,
//     setStartDate,
//     endDate,
//     setEndDate,
//     setSort,
//     sort,
//     applyFilters,
//   };
// }
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

export function useSearchFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Optional states (empty by default)
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "");
  const [startDate, setStartDate] = useState(searchParams.get("startDate") || "");
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "");
  const [rating, setRating] = useState(searchParams.get("rating")|| ""); 

  // Apply filters only if they have a value
  const applyFilters = () => {
    const params = new URLSearchParams(searchParams);

    const setOrDelete = (key: string, value: string) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    };

    setOrDelete("search", searchQuery);
    setOrDelete("status", statusFilter);
    setOrDelete("startDate", startDate);
    setOrDelete("endDate", endDate);
    setOrDelete("rating", rating);
    setOrDelete("sort", sort);

    params.set("page", "1"); // reset page on filter change
    setSearchParams(params);
  };

  // Sync states if URL changes externally
  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
    setStatusFilter(searchParams.get("status") || "");
    setStartDate(searchParams.get("startDate") || "");
    setEndDate(searchParams.get("endDate") || "");
    setSort(searchParams.get("sort") || "");
    setRating(searchParams.get("rating") || "");
  }, [searchParams]);

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    sort,
    setSort,
    rating,
    setRating,
    applyFilters,
  };
}
