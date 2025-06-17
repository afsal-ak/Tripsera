// // // import React, { useState } from "react";

// // // interface Props {
// // //   setFilters: (filters: any) => void;
// // // }

// // // const categories = ["Adventure", "Beach", "Cultural", "Wildlife", "Luxury"];

// // // const PackageFilterSidebar = () => {
// // //   const [startDate, setStartDate] = useState("");
// // //   const [endDate, setEndDate] = useState("");
// // //   const [location, setLocation] = useState("");
// // //   const [selectedCategory, setSelectedCategory] = useState("");
// // //   const [days, setDays] = useState("");
// // //   const [duration,setDuration]=useState("")

// // //   const handleClear = () => {
// // //     setStartDate("");
// // //     setEndDate("");
// // //     setLocation("");
// // //     setSelectedCategory("");
// // //     setDays("");
// // //   };

// // //   return (
// // //     <aside className="w-full md:w-64 bg-white dark:bg-background p-4 rounded-lg border border-border shadow-sm space-y-6">
// // //       <h3 className="text-xl font-semibold text-foreground">Filters</h3>
// // //   {/* Location */}
// // //       <div>
// // //         <label className="block text-sm font-medium text-muted-foreground mb-1">Location</label>
// // //         <input
// // //           type="text"
// // //           placeholder="Search by location"
// // //           value={location}
// // //           onChange={(e) => setLocation(e.target.value)}
// // //           className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange"
// // //         />
// // //       </div>

// // //       {/* Date Range */}
// // //       <div>
// // //         <label className="block text-sm font-medium text-muted-foreground mb-1">Start Date</label>
// // //         <input
// // //           type="date"
// // //           value={startDate}
// // //           onChange={(e) => setStartDate(e.target.value)}
// // //           className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange"
// // //         />
// // //       </div>
     

// // //       <div>
// // //         <label className="block text-sm font-medium text-muted-foreground mb-1">End Date</label>
// // //         <input
// // //           type="date"
// // //           value={endDate}
// // //           onChange={(e) => setEndDate(e.target.value)}
// // //           className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange"
// // //         />
// // //       </div>

    
// // //       {/* Category */}
// // //       <div>
// // //         <label className="block text-sm font-medium text-muted-foreground mb-1">Category</label>
// // //         <select
// // //           value={selectedCategory}
// // //           onChange={(e) => setSelectedCategory(e.target.value)}
// // //           className="w-full border border-border rounded px-3 py-2 text-sm bg-white dark:bg-background focus:outline-none focus:ring-2 focus:ring-orange"
// // //         >
// // //           <option value="">All Categories</option>
// // //           {categories.map((cat) => (
// // //             <option key={cat} value={cat}>{cat}</option>
// // //           ))}
// // //         </select>
// // //       </div>

    
// // //               <label className="block text-sm font-medium text-muted-foreground mb-1">Duration (Days)</label>

// // // <select value={duration} onChange={(e) => setDuration(e.target.value)}  className="w-full border border-border rounded px-3 py-2 text-sm bg-white dark:bg-background focus:outline-none focus:ring-2 focus:ring-orange"
// // // >
// // //   <option value="">Any Duration</option>
// // //   <option value="1-3">1-3 Days</option>
// // //   <option value="4-7">4-7 Days</option>
// // //   <option value="8-14">8-14 Days</option>
// // //   <option value="15+">15+ Days</option>
// // // </select>

// // //       <button
// // //         onClick={handleClear}
// // //         className="w-full mt-2 bg-orange text-white text-sm py-2 rounded hover:bg-orange-dark transition"
// // //       >
// // //         Clear Filters
// // //       </button>
// // //     </aside>
// // //   );
// // // };


// // // export default PackageFilterSidebar;

// // // import { useState,useEffect } from "react";

// // // interface Props {
// // //   setFilters: (filters: any) => void;
// // // }

// // // const PackageFilterSidebar: React.FC<Props> = ({ setFilters }) => {
// // //   const [location, setLocation] = useState("");
// // //   const [selectedCategory, setSelectedCategory] = useState("");
// // //   const [duration, setDuration] = useState("");
// // //   const [sort, setSort] = useState("newest");

// // //   const handleApplyFilters = () => {
// // //     const filters: any = {};
// // //     if (location) filters.location = location;
// // //     if (selectedCategory) filters.category = selectedCategory;
// // //     if (duration) filters.duration = duration;
// // //     if (sort) filters.sort = sort;

// // //     setFilters(filters);
// // //   };

// // //   const handleClear = () => {
// // //     setLocation("");
// // //     setSelectedCategory("");
// // //     setDuration("");
// // //     setSort("newest");
// // //     setFilters({});
// // //   };

// // //   return (
// // //     <aside className="w-full md:w-64 bg-white dark:bg-background p-4 rounded-lg border border-border shadow-sm space-y-6">
// // //       <h3 className="text-xl font-semibold text-foreground">Filters</h3>
      
// // //       <div>
// // //         <label className="block text-sm font-medium text-muted-foreground mb-1">Location</label>
// // //         <input
// // //           type="text"
// // //           value={location}
// // //           onChange={(e) => setLocation(e.target.value)}
// // //           placeholder="Search by location"
// // //           className="w-full border border-border rounded px-3 py-2 text-sm"
// // //         />
// // //       </div>

// // //       <div>
// // //         <label className="block text-sm font-medium text-muted-foreground mb-1">Category</label>
// // //         <select
// // //           value={selectedCategory}
// // //           onChange={(e) => setSelectedCategory(e.target.value)}
// // //           className="w-full border border-border rounded px-3 py-2 text-sm"
// // //         >
// // //           <option value="">All Categories</option>
// // //           <option value="Adventure">Adventure</option>
// // //           <option value="Beach">Beach</option>
// // //           <option value="Luxury">Luxury</option>
// // //           <option value="Wildlife">Wildlife</option>
// // //         </select>
// // //       </div>

// // //       <div>
// // //         <label className="block text-sm font-medium text-muted-foreground mb-1">Duration</label>
// // //         <select
// // //           value={duration}
// // //           onChange={(e) => setDuration(e.target.value)}
// // //           className="w-full border border-border rounded px-3 py-2 text-sm"
// // //         >
// // //           <option value="">Any Duration</option>
// // //           <option value="1-3">1-3 Days</option>
// // //           <option value="4-7">4-7 Days</option>
// // //           <option value="8-14">8-14 Days</option>
// // //           <option value="15+">15+ Days</option>
// // //         </select>
// // //       </div>

// // //       <div>
// // //         <label className="block text-sm font-medium text-muted-foreground mb-1">Sort By</label>
// // //         <select
// // //           value={sort}
// // //           onChange={(e) => setSort(e.target.value)}
// // //           className="w-full border border-border rounded px-3 py-2 text-sm"
// // //         >
// // //           <option value="newest">Newest</option>
// // //           <option value="oldest">Oldest</option>
// // //           <option value="price_asc">Price (Low to High)</option>
// // //           <option value="price_desc">Price (High to Low)</option>
// // //         </select>
// // //       </div>

// // //       <button onClick={handleApplyFilters} className="w-full bg-orange text-white py-2 rounded">
// // //         Apply Filters
// // //       </button>

// // //       <button onClick={handleClear} className="w-full mt-2 bg-gray-300 text-black py-2 rounded">
// // //         Clear Filters
// // //       </button>
// // //     </aside>
// // //   );
// // // };

// export default PackageFilterSidebar;
// import { useState,useEffect  } from "react";

// interface Props {
//     filters: any;

//   onFilterChange: (filters: any) => void;
//   onClear: () => void;
// }

// // const PackageFilterSidebar: React.FC<Props> = ({filters, onFilterChange, onClear }) => {
// //   const [location, setLocation] = useState(filters.location || "");
// //   const [selectedCategory, setSelectedCategory] = useState(filters.category || "");
// //   const [duration, setDuration] = useState(filters.duration || "");
// //   const [sort, setSort] = useState(filters.sort || "newest");
// //   const applyFilters = () => {
// //     onFilterChange({ location, category: selectedCategory, duration, sort });
// //   };
// //    useEffect(() => {
// //     setLocation(filters.location || "");
// //     setSelectedCategory(filters.category || "");
// //     setDuration(filters.duration || "");
// //     setSort(filters.sort || "newest");
// //   }, [filters]);


// const PackageFilterSidebar: React.FC<Props> = ({
//   filters,
//   onFilterChange,
//   onClear,
// }) => {
//   const [localFilters, setLocalFilters] = useState(filters);
//  const [duration, setDuration] = useState(filters.duration || "");
//    const [sort, setSort] = useState(filters.sort || "newest");
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setLocalFilters((prev:any) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   return (
//     <aside className="w-full md:w-64 bg-white dark:bg-background p-4 rounded-lg border border-border shadow-sm space-y-6">
//       <h3 className="text-xl font-semibold text-foreground">Filters</h3>
      
//       <div>
//         <label className="block text-sm font-medium text-muted-foreground mb-1">Location</label>
       
//       <input
//         name="search"
//         value={localFilters.search}
//         onChange={handleChange}
//         placeholder="Search by title/location"
//         className="w-full mb-2 px-3 py-2 border rounded"
//       />

//         {/* <input
//           type="text"
//           value={location}
//           onChange={(e) => setLocation(e.target.value)}
//           placeholder="Search by location"
//           className="w-full border border-border rounded px-3 py-2 text-sm"
//         /> */}
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-muted-foreground mb-1">Category</label>
//         {/* <select
//           value={selectedCategory}
//           onChange={(e) => setSelectedCategory(e.target.value)}
//           className="w-full border border-border rounded px-3 py-2 text-sm"
//         >
//           <option value="">All Categories</option>
//           <option value="Adventure">Adventure</option>
//           <option value="Beach">Beach</option>
//           <option value="Luxury">Luxury</option>
//           <option value="Wildlife">Wildlife</option>
//         </select> */}
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-muted-foreground mb-1">Duration</label>
//         <select
//           value={duration}
//           onChange={(e) => setDuration(e.target.value)}
//           className="w-full border border-border rounded px-3 py-2 text-sm"
//         >
//           <option value="">Any Duration</option>
//           <option value="1">1 Days</option>
//           <option value="2">2-Days</option>
//           <option value="3">3 Days</option>
//           <option value="4+">4 Days</option>
//         </select>
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-muted-foreground mb-1">Sort By</label>
//         <select
//           value={sort}
//           onChange={(e) => setSort(e.target.value)}
//           className="w-full border border-border rounded px-3 py-2 text-sm"
//         >
//           <option value="newest">Newest</option>
//           <option value="oldest">Oldest</option>
//           <option value="price_asc">Price (Low to High)</option>
//           <option value="price_desc">Price (High to Low)</option>
//         </select>
//       </div>

//       <button onClick={applyFilters} className="w-full bg-orange text-white py-2 rounded">
//         Apply Filters
//       </button>

//       <button onClick={onClear} className="w-full mt-2 bg-gray-300 text-black py-2 rounded">
//         Clear Filters
//       </button>
//     </aside>
//   );
// };

// export default PackageFilterSidebar;


import { useState, useEffect } from "react";

interface Props {
  filters: {
    search: string;
    location: string;
    category: string;
    duration: string;
    sort: "newest" | "oldest" | "price_asc" | "price_desc";
     startDate?: string;
  endDate?: string;
  };
  onFilterChange: (filters: any) => void;
  onClear: () => void;
}

const PackageFilterSidebar: React.FC<Props> = ({
  filters,
  onFilterChange,
  onClear,
}) => {
  
  const [localFilters, setLocalFilters] = useState({
  location: filters.location || "",
  category: filters.category || "",
  duration: filters.duration || "",
  sort: filters.sort || "newest",
  startDate: filters.startDate || "",
  endDate: filters.endDate || "",
});

useEffect(() => {
  setLocalFilters({
    location: filters.location || "",
    category: filters.category || "",
    duration: filters.duration || "",
    sort: filters.sort || "newest",
    startDate: filters.startDate || "",
    endDate: filters.endDate || "",
  });
}, [filters]);

  // Handle dropdown input changes
  const handleDropdownChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
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

  // Remove empty date filters to avoid unnecessary query strings
  if (!localFilters.startDate) delete filtersToSend.startDate;
  if (!localFilters.endDate) delete filtersToSend.endDate;

  onFilterChange(filtersToSend);
};

  // Handle live search change (immediate filter update)
  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    onFilterChange({ ...filters, search: value });
  };
const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;
  setLocalFilters((prev) => ({
    ...prev,
    [name]: value,
  }));
};
console.log("Sending filters:", {
  ...filters,
  ...localFilters,
});


  return (
    <aside className="w-full md:w-64 bg-white dark:bg-background p-4 rounded-lg border border-border shadow-sm space-y-6">
      <h3 className="text-xl font-semibold text-foreground">Filters</h3>

      {/* 🔍 Search Input */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-1">
          Search
        </label>
        <input
          name="search"
          value={filters.search}
          onChange={handleSearchChange}
          placeholder="Search by title or location"
          className="w-full mb-2 px-3 py-2 border rounded"
        />
      </div>

      {/* 🗂️ Category Dropdown */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-1">
          Category
        </label>
        <select
          name="category"
          value={localFilters.category}
          onChange={handleDropdownChange}
          className="w-full border border-border rounded px-3 py-2 text-sm"
        >
          <option value="">All Categories</option>
          <option value="Adventure">Adventure</option>
          <option value="Beach">Beach</option>
          <option value="Luxury">Luxury</option>
          <option value="Wildlife">Wildlife</option>
        </select>
      </div>

      {/* ⏳ Duration Dropdown */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-1">
          Duration
        </label>
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
{/* 📅 Date Range Picker */}
<div>
  <label className="block text-sm font-medium text-muted-foreground mb-1">
    Start Date
  </label>
 <input
  type="date"
  name="startDate"
  value={localFilters.startDate}
  onChange={(e) =>
    setLocalFilters((prev) => ({ ...prev, startDate: e.target.value }))
  } className="w-full border border-border rounded px-3 py-2 text-sm"

/>

  <label className="block text-sm font-medium text-muted-foreground mb-1">
    End Date
  </label>
 
<input
  type="date"
  name="endDate"
  value={localFilters.endDate}
  onChange={(e) =>
    setLocalFilters((prev) => ({ ...prev, endDate: e.target.value }))
  }className="w-full border border-border rounded px-3 py-2 text-sm"

/>
</div>

      {/* ↕️ Sort Dropdown */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-1">
          Sort By
        </label>
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

      {/* ✅ Apply + ❌ Clear Buttons */}
      <button
        onClick={applyFilters}
        className="w-full bg-orange text-white py-2 rounded"
      >
        Apply Filters
      </button>

      <button
        onClick={onClear}
        className="w-full mt-2 bg-gray-300 text-black py-2 rounded"
      >
        Clear Filters
      </button>
    </aside>
  );
};

export default PackageFilterSidebar;




// import React, { useState } from "react";

// interface Props {
//   filters: {
//     location: string;
//     category: string;
//     duration: string;
//     sort: string;
//   };
//   onFilterChange: (filters: Partial<Record<string, string>>) => void;
//   onClear: () => void;
// }

// const PackageFilterSidebar: React.FC<Props> = ({ filters, onFilterChange, onClear }) => {
//   const [localFilters, setLocalFilters] = useState(filters);

//   const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
//     const { name, value } = e.target;
//     const newFilters = { ...localFilters, [name]: value };
//     setLocalFilters(newFilters);
//     onFilterChange({ [name]: value });
//   };

//   return (
//     <div className="w-full md:w-64 bg-card p-4 rounded shadow">
//       <h3 className="text-lg font-semibold mb-4">Filters</h3>

//       <label className="block mb-2 text-sm font-medium">Location</label>
//       <input
//         type="text"
//         name="location"
//         value={localFilters.location}
//         onChange={handleChange}
//         className="w-full mb-4 p-2 border rounded"
//       />

//       <label className="block mb-2 text-sm font-medium">Category</label>
//       <input
//         type="text"
//         name="category"
//         value={localFilters.category}
//         onChange={handleChange}
//         className="w-full mb-4 p-2 border rounded"
//       />

//       <label className="block mb-2 text-sm font-medium">Duration</label>
//       <input
//         type="text"
//         name="duration"
//         value={localFilters.duration}
//         onChange={handleChange}
//         className="w-full mb-4 p-2 border rounded"
//       />

//       <label className="block mb-2 text-sm font-medium">Sort</label>
//       <select
//         name="sort"
//         value={localFilters.sort}
//         onChange={handleChange}
//         className="w-full mb-4 p-2 border rounded"
//       >
//         <option value="newest">Newest</option>
//         <option value="oldest">Oldest</option>
//         <option value="price_asc">Price: Low to High</option>
//         <option value="price_desc">Price: High to Low</option>
//       </select>

//       <button
//         onClick={onClear}
//         className="w-full bg-red-500 text-white py-2 rounded"
//       >
//         Clear Filters
//       </button>
//     </div>
//   );
// };

// export default PackageFilterSidebar;



// import React, { useState } from "react";

// interface Props {
//   filters: any;
//   onFilterChange: (filters: any) => void;
//   onClear: () => void;
// }

// const PackageFilterSidebar: React.FC<Props> = ({
//   filters,
//   onFilterChange,
//   onClear,
// }) => {
//   const [localFilters, setLocalFilters] = useState(filters);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setLocalFilters((prev:any) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = () => {
//     onFilterChange(localFilters);
//   };

//   return (
//     <div className="w-full md:w-1/4">
//       <h3 className="text-lg font-semibold mb-4 text-foreground">Filters</h3>

//       <input
//         name="search"
//         value={localFilters.search}
//         onChange={handleChange}
//         placeholder="Search by title/location"
//         className="w-full mb-2 px-3 py-2 border rounded"
//       />

//       <input
//         name="location"
//         value={localFilters.location}
//         onChange={handleChange}
//         placeholder="Location"
//         className="w-full mb-2 px-3 py-2 border rounded"
//       />

//       <select
//         name="category"
//         value={localFilters.category}
//         onChange={handleChange}
//         className="w-full mb-2 px-3 py-2 border rounded"
//       >
//         <option value="">All Categories</option>
//         <option value="Adventure">Adventure</option>
//         <option value="Relax">Relax</option>
//         {/* Add more dynamically if needed */}
//       </select>

//       <select
//         name="sort"
//         value={localFilters.sort}
//         onChange={handleChange}
//         className="w-full mb-2 px-3 py-2 border rounded"
//       >
//         <option value="newest">Newest</option>
//         <option value="oldest">Oldest</option>
//         <option value="price_asc">Price Low to High</option>
//         <option value="price_desc">Price High to Low</option>
//       </select>

//       <button
//         onClick={handleSubmit}
//         className="w-full py-2 mt-2 bg-blue-500 text-white rounded"
//       >
//         Apply Filters
//       </button>

//       <button
//         onClick={onClear}
//         className="w-full py-2 mt-2 bg-red-500 text-white rounded"
//       >
//         Clear Filters
//       </button>
//     </div>
//   );
// };

// export default PackageFilterSidebar;
