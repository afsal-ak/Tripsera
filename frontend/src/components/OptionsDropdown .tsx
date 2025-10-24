// src/components/OptionsDropdown.tsx
import { useState, useRef, useEffect } from 'react';

interface Option {
  label: string;
  value: string;
  className?: string;
}

interface OptionsDropdownProps {
  options: Option[];
  onSelect: (value: string) => void;
triggerElement?: React.ReactNode;
}

export const OptionsDropdown = ({ options, onSelect, triggerElement }: OptionsDropdownProps) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <div onClick={() => setOpen((prev) => !prev)} className="cursor-pointer">
        {triggerElement}
      </div>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden z-50">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onSelect(option.value);
                setOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 text-gray-700 hover:bg-orange/10 hover:text-orange transition ${option.className || ''}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};


// import { useState, useRef, useEffect } from 'react';
// import { MoreHorizontal } from 'lucide-react';
// type Option = {
//   label: string;
//   value: string;
//   className?: string;
// };

// type OptionsDropdownProps = {
//   options: Option[];
//   onSelect: (value: string) => void;
// };

// export const OptionsDropdown = ({ options, onSelect }: OptionsDropdownProps) => {
//   const [open, setOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   // Close dropdown if click outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setOpen(false);
//       }
//     };
//     if (open) {
//       document.addEventListener('mousedown', handleClickOutside);
//     } else {
//       document.removeEventListener('mousedown', handleClickOutside);
//     }
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [open]);

//   const toggleDropdown = () => setOpen((prev) => !prev);

//   const handleSelect = (value: string) => {
//     onSelect(value);
//     setOpen(false);
//   };

//   return (
//     <div className="relative inline-block text-left" ref={dropdownRef}>
//       <button
//         onClick={toggleDropdown}
//         className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         aria-haspopup="true"
//         aria-expanded={open}
//         aria-label="Open options menu"
//       >
//         <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
//       </button>

//       {open && (
//         <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
//           <div className="py-1">
//             {options.map((option) => (
//               <div
//                 key={option.value}
//                 onClick={() => onSelect(option.value)}
//                 className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${option.className || ''}`}
//               >
//                 {option.label}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
