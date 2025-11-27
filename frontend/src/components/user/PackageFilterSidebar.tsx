import { useState, useEffect } from 'react';
import { getCategory } from '../../services/admin/packageService';
import { X } from 'lucide-react';

interface ICategory {
  _id: string;
  name: string;
}

interface Props {
  filters: {
    search: string;
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
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const [localFilters, setLocalFilters] = useState({
    category: filters.category || '',
    duration: filters.duration || '',
    sort: filters.sort || 'newest',
    startDate: filters.startDate || '',
    endDate: filters.endDate || '',
  });

  useEffect(() => {
    setLocalFilters({
      category: filters.category || '',
      duration: filters.duration || '',
      sort: filters.sort || 'newest',
      startDate: filters.startDate || '',
      endDate: filters.endDate || '',
    });
  }, [filters]);

  useEffect(() => {
    const loadCat = async () => {
      try {
        const cat = await getCategory();
        setCategory(cat);
      } catch (error) {
        console.log(error);
      }
    };
    loadCat();
  }, []);

  // Common live filter update
  const updateAndSendFilters = (updated: Partial<typeof localFilters>) => {
    const newFilters = { ...localFilters, ...updated };
    setLocalFilters(newFilters);
    onFilterChange({ ...filters, ...newFilters });
  };

  return (
    <>
      {/*  Sidebar */}
      <aside className="w-full md:w-64 bg-white dark:bg-background p-4 border border-border shadow-md space-y-6">
        <h3 className="text-2xl font-bold text-orange-600 border-b pb-2">Filters</h3>

        {/* Category with modal */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Category</label>
          <button
            onClick={() => setShowCategoryModal(true)}
            className="w-full border border-border rounded-lg px-3 py-2 text-left text-sm bg-gray-50 hover:bg-gray-100 transition"
          >
            {category.find((cat) => cat._id === localFilters.category)?.name || 'All Categories'}
          </button>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Duration</label>
          <select
            name="duration"
            value={localFilters.duration}
            onChange={(e) => updateAndSendFilters({ duration: e.target.value })}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 transition"
          >
            <option value="">Any Duration</option>
            <option value="1">1 Day</option>
            <option value="2">2 Days</option>
            <option value="3">3 Days</option>
            <option value="4">4 Days</option>
            <option value="5">5 Days</option>
            <option value="6">6+ Days</option>
          </select>
        </div>

        {/* Dates */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={localFilters.startDate}
            onChange={(e) => {
              const startDate = e.target.value;
              const endDate =
                localFilters.endDate && startDate > localFilters.endDate
                  ? ''
                  : localFilters.endDate;
              updateAndSendFilters({ startDate, endDate });
            }}
            min={new Date().toISOString().split('T')[0]}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 transition"
          />

          <label className="block text-sm font-semibold text-gray-600 mb-1 mt-3">End Date</label>
          <input
            type="date"
            name="endDate"
            value={localFilters.endDate}
            onChange={(e) => updateAndSendFilters({ endDate: e.target.value })}
            min={localFilters.startDate || new Date().toISOString().split('T')[0]}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 transition"
          />
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Sort By</label>
          <select
            name="sort"
            value={localFilters.sort}
            onChange={(e) => updateAndSendFilters({ sort: e.target.value as any })}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 transition"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="price_asc">Price (Low to High)</option>
            <option value="price_desc">Price (High to Low)</option>
          </select>
        </div>

        {/* Clear button */}


        <button onClick={onClear} className="w-full bg-orange text-white py-2 rounded">
          Clear Filters
        </button>

      </aside>

      {/*  Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-80 max-h-[80vh] overflow-y-auto relative p-5">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-orange-600">Select Category</h2>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Category list */}
            <ul className="space-y-2">
              <li>
                <button
                  className={`w-full text-left px-3 py-2 rounded-lg transition ${!localFilters.category
                    ? 'bg-orange-500 text-white'
                    : 'hover:bg-orange-50 text-gray-700'
                    }`}
                  onClick={() => {
                    updateAndSendFilters({ category: '' });
                    setShowCategoryModal(false);
                  }}
                >
                  All Categories
                </button>
              </li>

              {category.map((cat) => (
                <li key={cat._id}>
                  <button
                    className={`w-full text-left px-3 py-2 rounded-lg transition ${localFilters.category === cat._id
                      ? 'bg-orange text-white'
                      : 'hover:bg-orange-50 text-gray-700'
                      }`}
                    onClick={() => {
                      updateAndSendFilters({ category: cat._id });
                      setShowCategoryModal(false);
                    }}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default PackageFilterSidebar;

