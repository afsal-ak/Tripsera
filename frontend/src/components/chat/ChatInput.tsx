import { useState, useRef } from "react";
import { Send, Paperclip } from "lucide-react";
import { Button } from "@/components/Button";
import ImageUpload from "@/components/chat/ImageUpload";
import AttachmentMenu from "@/components/chat/AttachmentMenu";
import { uploadFile } from "@/services/user/messageService";
import { MessageType } from "@/types/IMessage";

interface ChatInputProps {
  messageInput: string;
  setMessageInput: (val: string) => void;
  handleSendMessage: () => void;
  startTyping: () => void;
  stopTyping: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  messageInput,
  setMessageInput,
  handleSendMessage,
  startTyping,
  stopTyping,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedUpload, setSelectedUpload] = useState<
    "image" | "audio" | "file" | null
  >(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file picker for audio / file
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, type: "audio" | "file") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      const response = await uploadFile(formData);
      console.log("Uploaded:", response.data);
      // TODO: send message via socket here with file URL + type
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  return (
    <div className="p-2 sm:p-3 bg-gray-50 border-t border-gray-200 relative">
      <div className="flex items-center gap-2 sm:gap-3">

        {/* 📎 Attachment Button */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 rounded-full hover:bg-gray-200"
        >
          <Paperclip size={20} />
        </button>

        {/* 📂 Attachment Menu */}
        {showMenu && (
          <AttachmentMenu
            onSelect={(type) => {
              setSelectedUpload(type);
              setShowMenu(false);

              if (type === "image") {
                // open cropper directly via state
                setSelectedUpload("image");
              } else {
                // Trigger hidden file input for audio/file
                if (fileInputRef.current) {
                  fileInputRef.current.accept = type === "audio" ? "audio/*" : "*/*";
                  fileInputRef.current.click();
                }
              }
            }}
            onClose={() => setShowMenu(false)}
          />
        )}

        {/* 🖼 Image Upload with Cropper */}
        {selectedUpload === "image" && (
          <ImageUpload
            onUpload={(file) => {
              console.log("Cropped image ready:", file);
              // TODO: send message with image file URL here
              setSelectedUpload(null); // close after upload
            }}
          />
        )}

        {/* Hidden File Input for audio/file */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) =>
            handleFileSelect(
              e,
              fileInputRef.current?.accept === "audio/*" ? "audio" : "file"
            )
          }
          className="hidden"
        />

        {/* ✍️ Message Input */}
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 rounded-full border border-gray-300 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base focus:ring focus:ring-blue-300 outline-none"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={(e) => {
            startTyping();
            if (e.key === "Enter") handleSendMessage();
          }}
          onBlur={stopTyping}
        />

        {/* 🚀 Send Button */}
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white p-2 sm:p-3 rounded-full hover:bg-blue-600 transition"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
