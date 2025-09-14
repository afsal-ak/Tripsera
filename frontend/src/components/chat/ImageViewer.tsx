import React, { useState } from "react";
import { X } from "lucide-react";

interface Props {
  src: string;
  alt?: string;
  className?: string;
}

const ImageViewer: React.FC<Props> = ({ src, alt = "Image", className }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
       <img
        src={src}
        alt={alt}
        className={`cursor-pointer rounded-lg ${className}`}
        onClick={() => setIsOpen(true)}
      />

      {/* Fullscreen Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-white"
          >
            <X size={28} />
          </button>
          <img
            src={src}
            alt={alt}
            className="max-h-[90%] max-w-[95%] object-contain rounded-lg shadow-lg"
          />
        </div>
      )}
    </>
  );
};

export default ImageViewer;
