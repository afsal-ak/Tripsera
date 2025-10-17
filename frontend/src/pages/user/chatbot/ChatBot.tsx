import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { chatWithBot } from "@/services/user/chatbotService";
import { Send, Bot, User } from "lucide-react";

interface IFormInput {
  message: string;
}

const ChatBot = () => {
  const { register, handleSubmit, reset } = useForm<IFormInput>();
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<{ role: string; text: string }[]>([]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);



  const onSubmit = async (data: IFormInput) => {
    const userMsg = data.message.trim();
    if (!userMsg) return;

    setConversation((prev) => [...prev, { role: "user", text: userMsg }]);
    reset();
    setLoading(true);

    try {
      const botReply = await chatWithBot(userMsg);
      setConversation((prev) => [...prev, { role: "bot", text: botReply }]);
    } catch (error: any) {
      setConversation((prev) => [
        ...prev,
        { role: "bot", text: error.message || "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-6">
      {/* Chatbot Card */}
      <div className="w-full bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center gap-3">
          <Bot className="text-white w-6 h-6" />
          <h2 className="text-white text-xl font-semibold">Picnigo AI Travel Assistant</h2>
        </div>

        {/* Chat Area */}
        <div className="h-96 overflow-y-auto p-4 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {conversation.length === 0 && !loading && (
            <p className="text-gray-500 text-center mt-20">
              👋 Start chatting with your AI travel assistant...
            </p>
          )}

          {conversation.map((msg, index) => (
            <div
              key={index}
              className={`flex my-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex items-start gap-2 max-w-[80%] ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                {/* Avatar */}
                <div
                  className={`rounded-full p-2 ${
                    msg.role === "user" ? "bg-blue-600" : "bg-green-600"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="text-white w-4 h-4" />
                  ) : (
                    <Bot className="text-white w-4 h-4" />
                  )}
                </div>

                {/* Message */}
                <div
                  className={`px-4 py-2 rounded-2xl text-sm leading-relaxed shadow-md ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-200 text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 mt-2">
              <Bot className="text-green-600 w-4 h-4" />
              <p className="text-gray-500 animate-pulse">Thinking...</p>
            </div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        {/* Input Area */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex items-center gap-2 p-4 bg-white border-t"
        >
          <input
            {...register("message", { required: true })}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 transition text-white p-2 rounded-full shadow-md disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;
