import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import type { IChatRoom } from '@/types/IMessage';

interface Props {
  onRoomSelect: (room: IChatRoom) => void;
  placeholder?: string;
}

export default function RoomSearch({ onRoomSelect, placeholder = 'Search chats...' }: Props) {
  const rooms = useSelector((state: RootState) => state.chatRoom.rooms || []);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<IChatRoom[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // simple debounce
    const t = setTimeout(() => {
      const q = query.trim().toLowerCase();
      if (!q) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      // filter locally: otherUser.username, otherUser.fullName (if stored), room.name, lastMessageContent
      const filtered = rooms.filter((room) => {
        const other = room.otherUser;
        const username = other?.username?.toLowerCase() ?? '';
        const fullName = (other as any)?.fullName?.toLowerCase?.() ?? '';
        const roomName = room.name?.toLowerCase() ?? '';
        const last = (room.lastMessageContent ?? '').toLowerCase();

        return (
          username.includes(q) ||
          fullName.includes(q) ||
          roomName.includes(q) ||
          last.includes(q)
        );
      });

      setResults(filtered);
      setLoading(false);
    }, 200);

    return () => clearTimeout(t);
  }, [query, rooms]);

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="flex items-center bg-gray-100 rounded-full px-3 py-2 mb-2">
        <Search size={18} className="text-gray-400 mr-2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent focus:outline-none text-gray-700"
        />
      </div>

      <div className="max-h-64 overflow-y-auto bg-white rounded-md shadow-sm border border-gray-100">
        {loading && <p className="p-3 text-sm text-gray-500">Searching...</p>}

        {!loading && query.trim() !== '' && results.length === 0 && (
          <p className="p-3 text-sm text-gray-500">No chats found</p>
        )}

        {!loading && results.map((room) => {
          const other = room.otherUser;
          const title = room.isGroup ? room.name ?? 'Group' : other?.username ?? 'Unknown';
          const subtitle = (!room.isGroup && (other as any)?.fullName) || room.lastMessageContent || '';

          return (
            <button
              key={room._id}
              onClick={() => {
                setQuery('');
                setResults([]);
                onRoomSelect(room);
              }}
              className="w-full text-left flex items-center p-3 hover:bg-gray-50 border-b border-gray-100"
            >
              <img
                src={other?.profileImage || '/profile-default.jpg'}
                alt={title}
                className="w-10 h-10 rounded-full object-cover mr-3 border"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">{title}</p>
                  <span className="text-xs text-gray-400">{/* optionally show date */}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{subtitle}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
