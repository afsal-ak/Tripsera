import { useState, useEffect } from 'react';
import { getCategory } from '../../services/admin/packageService';
interface ICategory {
  _id: string;
  name: string;
}

interface Props {
  filters: {
    search: string;
    // location: string;
    category: string;
    duration: string;
    sort: 'newest' | 'oldest' | 'price_asc' | 'price_desc';
    startDate?: string;
    endDate?: string;
  };
  onFilterChange: (filters: any) => void;
  onClear: () => void;
}

const PackageFilterSidebar: React.FC<Props> = ({ filters, onFilterChange, onClear }) => {
  const [category, setCategory] = useState<ICategory[]>([]);

  const [localFilters, setLocalFilters] = useState({
    // location: filters.location || "",
    category: filters.category || '',
    duration: filters.duration || '',
    sort: filters.sort || 'newest',
    startDate: filters.startDate || '',
    endDate: filters.endDate || '',
  });

  useEffect(() => {
    setLocalFilters({
      //  location: filters.location || "",
      category: filters.category || '',
      duration: filters.duration || '',
      sort: filters.sort || 'newest',
      startDate: filters.startDate || '',
      endDate: filters.endDate || '',
    });
  }, [filters]);

  // Handle dropdown input changes
  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const applyFilters = () => {
    const filtersToSend: any = {
      ...filters,
      ...localFilters,
    };

    if (!localFilters.startDate) delete filtersToSend.startDate;
    if (!localFilters.endDate) delete filtersToSend.endDate;

    onFilterChange(filtersToSend);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const loadCat = async () => {
      try {
        const cat = await getCategory();
        setCategory(cat);
        //console.log('d')
      } catch (error) {
        console.log(error);
      }
    };
    loadCat();
  }, []);
  //console.log(category,'cat')
  return (
    <aside className="w-full md:w-64 bg-white dark:bg-background p-4 rounded-lg border border-border shadow-sm space-y-6">
      <h3 className="text-xl font-semibold text-foreground">Filters</h3>

      {/*  Category Dropdown */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-1">Category</label>
        <select
          name="category"
          value={localFilters.category || ''}
          onChange={handleDropdownChange}
          className="w-full border border-border rounded px-3 py-2 text-sm"
        >
          <option value="">All Categories</option>
          {category?.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-1">Duration</label>
        <select
          name="duration"
          value={localFilters.duration}
          onChange={handleDropdownChange}
          className="w-full border border-border rounded px-3 py-2 text-sm"
        >
          <option value="">Any Duration</option>
          <option value="1">1 Day</option>
          <option value="2">2 Days</option>
          <option value="3">3 Days</option>
          <option value="7">4+ Days</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-1">Start Date</label>
        <input
          type="date"
          name="startDate"
          value={localFilters.startDate}
          onChange={(e) => {
            const newStartDate = e.target.value;
            setLocalFilters((prev) => {
              const shouldClearEndDate = prev.endDate && newStartDate > prev.endDate;
              return {
                ...prev,
                startDate: newStartDate,
                endDate: shouldClearEndDate ? '' : prev.endDate,
              };
            });
          }}
          min={new Date().toISOString().split('T')[0]}
          className="w-full border border-border rounded px-3 py-2 text-sm"
        />

        <label className="block text-sm font-medium text-muted-foreground mb-1">End Date</label>

        <input
          type="date"
          name="endDate"
          value={localFilters.endDate}
          onChange={(e) => setLocalFilters((prev) => ({ ...prev, endDate: e.target.value }))}
          //   min={new Date().toISOString().split("T")[0]}
          min={
            localFilters.startDate ? localFilters.startDate : new Date().toISOString().split('T')[0]
          }
          className="w-full border border-border rounded px-3 py-2 text-sm"
        />
      </div>

      {/*  Sort Dropdown */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-1">Sort By</label>
        <select
          name="sort"
          value={localFilters.sort}
          onChange={handleDropdownChange}
          className="w-full border border-border rounded px-3 py-2 text-sm"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="price_asc">Price (Low to High)</option>
          <option value="price_desc">Price (High to Low)</option>
        </select>
      </div>

      {/*  Apply Clear Buttons */}
      <button onClick={applyFilters} className="w-full bg-orange text-white py-2 rounded">
        Apply Filters
      </button>

      <button onClick={onClear} className="w-full mt-2 bg-gray-300 text-black py-2 rounded">
        Clear Filters
      </button>
    </aside>
  );
};

export default PackageFilterSidebar;
