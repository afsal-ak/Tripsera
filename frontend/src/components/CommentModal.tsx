import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import CommentSection from "./CommentSection";

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  parentId: string;
  parentType: "blog" | "package" | "post";
}

const CommentModal = ({
  isOpen,
  onClose,
  imageUrl,
  parentId,
  parentType,
}: CommentModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
            className="relative flex bg-white rounded-2xl overflow-hidden w-[900px] h-[600px] shadow-2xl"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            {/* Left side: Image */}
            <div className="flex-1 bg-black flex items-center justify-center">
              <img
                src={imageUrl || "/default-blog.jpg"}
                alt="Post"
                className="object-contain max-h-full max-w-full"
              />
            </div>

            {/* Right side: Comments */}
            <div className="w-[380px] flex flex-col border-l">
              {/* Header */}
              <div className="flex justify-between items-center p-3 border-b">
                <h2 className="text-base font-semibold">Comments</h2>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-gray-100 transition"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Comment Section */}
              <CommentSection parentId={parentId} parentType={parentType} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommentModal;
