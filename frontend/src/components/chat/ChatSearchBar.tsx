import { Search, X } from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function ChatSearchBar({ value, onChange }: Props) {
  return (
    <div className="p-2 border-b">
      <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md">
        <Search size={16} className="text-gray-500 mr-2" />

        <input
          type="text"
          placeholder="Search chats..."
          className="flex-1 bg-transparent outline-none text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />

        {value && (
          <button
            onClick={() => onChange('')}
            className="text-gray-400 hover:text-gray-700"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}