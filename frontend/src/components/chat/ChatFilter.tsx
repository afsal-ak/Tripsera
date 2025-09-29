// import { useState } from "react";
// import { Filter as FilterIcon } from "lucide-react";

// interface Props{
//     totalUnread:number
// }

// export default function ChatFilter({totalUnread}:Props) {
//   const [filterOpen, setFilterOpen] = useState(false);
//   const [activeFilter, setActiveFilter] = useState<"All" | "Unread" | "Read">("All");

//   const handleSelect = (filter: "All" | "Unread" | "Read") => {
//     setActiveFilter(filter);
//     setFilterOpen(false); 
//   };

//   return (
//     <div className="relative">
//       {/* Filter button */}
//       <button
//         onClick={() => setFilterOpen(!filterOpen)}
//         className="p-2 hover:bg-blue-700 rounded-full transition-colors"
//       >
//         <FilterIcon className="w-5 h-5" />
//             {/* Badge on icon */}
//         {totalUnread > 0 && (
//           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
//             {totalUnread}
//           </span>
//         )}
//        </button>

//       {/* Dropdown menu */}
//       {filterOpen && (
//         <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-md z-10">
//           {["All", "Unread", "Read"].map((filter) => (
//             <button
//               key={filter}
//               onClick={() => handleSelect(filter as "All" | "Unread" | "Read")}
//               className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
//                 activeFilter === filter
//                   ? "text-blue-600 font-medium"
//                   : "text-gray-700"
//               }`}
//             >
//               {filter}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// import { useState } from "react";
// import { Filter as FilterIcon } from "lucide-react";
// import { useDispatch } from "react-redux";
// import type{ AppDispatch } from "@/redux/store";

// interface Props {
//     role:'user'|'admin',
//   totalUnread: number;
// }

// export default function ChatFilter({role, totalUnread }: Props) {
//   const [filterOpen, setFilterOpen] = useState(false);
//   const [activeFilter, setActiveFilter] = useState<"All" | "Unread" | "Read">(
//     "All"
//   );

//   const handleSelect = (filter: "All" | "Unread" | "Read") => {
//     setActiveFilter(filter);
//     setFilterOpen(false);
//   };

//   return (
//     <div className="relative">
//       {/* Filter button */}
//       <button
//         onClick={() => setFilterOpen(!filterOpen)}
//         className="p-2 hover:bg-blue-700 rounded-full transition-colors"
//       >
//         <FilterIcon className="w-5 h-5" />
//       </button>

//       {/* Dropdown menu */}
//       {filterOpen && (
//         <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-md z-10">
//           {/* All */}
//           <button
//             onClick={() => handleSelect("All")}
//             className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
//               activeFilter === "All"
//                 ? "text-blue-600 font-medium"
//                 : "text-gray-700"
//             }`}
//           >
//             All
//           </button>

//           {/* Unread with count */}
//           <button
//             onClick={() => handleSelect("Unread")}
//             className={`w-full flex justify-between items-center px-4 py-2 hover:bg-gray-100 ${
//               activeFilter === "Unread"
//                 ? "text-blue-600 font-medium"
//                 : "text-gray-700"
//             }`}
//           >
//             <span>Unread</span>
//             <span className="ml-2 bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">
//               {totalUnread}
//             </span>
//           </button>

//           {/* Read */}
//           <button
//             onClick={() => handleSelect("Read")}
//             className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
//               activeFilter === "Read"
//                 ? "text-blue-600 font-medium"
//                 : "text-gray-700"
//             }`}
//           >
//             Read
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState } from "react";
import { Filter as FilterIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { fetchUserRooms } from "@/redux/slices/chatRoomSlice";

interface Props {
  role: "user" | "admin";
  totalUnread: number;
}

export default function ChatFilter({ role, totalUnread }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"All" | "Unread" | "Read">(
    "All"
  );

  const handleSelect = (filter: "All" | "Unread" | "Read") => {
    setActiveFilter(filter);
    setFilterOpen(false);

    // Dispatch fetch with selected filter
    const filterParam = filter.toLowerCase(); 
    
    dispatch(
      fetchUserRooms({
        isAdmin: role === "admin",
        filters: { filter: filterParam as "all" | "unread" | "read" },
      })
    );
  };

  return (
    <div className="relative">
      {/* Filter button */}
      <button
        onClick={() => setFilterOpen(!filterOpen)}
        className="p-2 hover:bg-blue-700 rounded-full transition-colors"
      >
        <FilterIcon className="w-5 h-5" />
      </button>

      {/* Dropdown menu */}
      {filterOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-md z-10">
          {/* All */}
          <button
            onClick={() => handleSelect("All")}
            className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
              activeFilter === "All"
                ? "text-blue-600 font-medium"
                : "text-gray-700"
            }`}
          >
            All
          </button>

          {/* Unread with count */}
          <button
            onClick={() => handleSelect("Unread")}
            className={`w-full flex justify-between items-center px-4 py-2 hover:bg-gray-100 ${
              activeFilter === "Unread"
                ? "text-blue-600 font-medium"
                : "text-gray-700"
            }`}
          >
            <span>Unread</span>
            <span className="ml-2 bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">
              {totalUnread}
            </span>
          </button>

          {/* Read */}
          <button
            onClick={() => handleSelect("Read")}
            className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
              activeFilter === "Read"
                ? "text-blue-600 font-medium"
                : "text-gray-700"
            }`}
          >
            Read
          </button>
        </div>
      )}
    </div>
  );
}
