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
  const [customFilter, setCustomFilter] = useState(searchParams.get("cutomFilter")|| ""); 

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
    setOrDelete("customFilter", customFilter);

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
    setCustomFilter(searchParams.get("customFilter") || "");
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
    customFilter,
    setCustomFilter,
    setRating,
    applyFilters,
  };
}
