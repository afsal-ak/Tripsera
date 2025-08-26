import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";

const ChatbotLauncher = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-6 right-6 z-50"
    >
      {/* Glowing Robot Button */}
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate("/chatbot")}
        className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-[0_0_15px_rgba(59,130,246,0.6)] hover:shadow-[0_0_25px_rgba(168,85,247,0.8)] transition-all duration-300"
      >
        {/* Robot Icon */}
        <Bot className="w-8 h-8 text-white drop-shadow-lg" />

        {/* Glow Pulse Effect */}
        <span className="absolute w-20 h-20 rounded-full bg-blue-400 opacity-20 animate-ping"></span>
      </motion.button>

      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileHover={{ opacity: 1, x: 0 }}
        className="absolute right-20 bottom-4 bg-gray-900 text-white text-sm px-4 py-1.5 rounded-lg shadow-md hidden md:block"
      >
        Need Help? 🤖
      </motion.div>
    </motion.div>
  );
};

export default ChatbotLauncher;
