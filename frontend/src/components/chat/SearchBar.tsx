import { Search } from 'lucide-react';
// Search Bar Component
export const SearchBar: React.FC<{ search: string; setSearch: (value: string) => void }> = ({
  search,
  setSearch,
}) => (
  <div className="p-3 bg-blue-50 border-b border-blue-100">
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        placeholder="Search travel conversations..."
        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  </div>
);
