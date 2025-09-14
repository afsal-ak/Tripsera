// components/chat/AttachmentMenu.tsx
import React from "react";
import { Image, File, Mic } from "lucide-react";

interface Props {
  onSelect: (type: "image" | "audio" | "file") => void;
  onClose: () => void;
}

const AttachmentMenu: React.FC<Props> = ({ onSelect, onClose }) => {
  return (
    <div className="absolute bottom-14 left-0 bg-white shadow-lg rounded-lg p-2 flex flex-col gap-2 w-40 z-50">
      <button
        onClick={() => {
          onSelect("image");
          
          onClose();
        }}
        className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded"
      >
        <Image size={18} /> Image
      </button>
      <button
        onClick={() => {
          onSelect("audio");
          onClose();
        }}
        className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded"
      >
        <Mic size={18} /> Audio
      </button>
      <button
        onClick={() => {
          onSelect("file");
          onClose();
        }}
        className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded"
      >
        <File size={18} /> File
      </button>
    </div>
  );
};

export default AttachmentMenu;
