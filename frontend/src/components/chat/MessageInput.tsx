import { useState } from "react";
import { Send } from "lucide-react";

const MessageInput = () => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
   // console.log("Send:", message);
    setMessage("");
  };

  return (
    <div className="flex items-center p-3 bg-white border-t border-border">
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 p-2 rounded-lg border border-border outline-none"
      />
      <button
        onClick={handleSend}
        className="ml-3 bg-orange hover:bg-orange-dark text-white p-2 rounded-full"
      >
        <Send size={20} />
      </button>
    </div>
  );
};

export default MessageInput;
