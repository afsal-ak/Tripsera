import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import {
  fetchComments,
  addComment,
  addReply,
  fetchReplies,
  deleteComment,
} from '@/services/user/commentService';
import type { IComment, ReplyComment } from '@/types/IComment';
import type { RootState } from '@/redux/store';
import { OptionsDropdown } from './OptionsDropdown ';
import { useLoadMore } from '@/hooks/useLoadMore';

interface CommentSectionProps {
  parentId: string;
  parentType: 'blog' | 'package' | 'post';
}

const CommentSection = ({ parentId, parentType }: CommentSectionProps) => {
  const currentUser = useSelector((state: RootState) => state.userAuth.user);

  const [comments, setComments] = useState<IComment[]>([]);
  const [text, setText] = useState('');
  const [replyMap, setReplyMap] = useState<Record<string, IComment[]>>({});
  const [replyPage, setReplyPage] = useState<Record<string, number>>({});
  const [hasMoreReplies, setHasMoreReplies] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 5;

  useEffect(() => {
    loadComments(1);
  }, []);

  // Load main comments
  const loadComments = async (pageParam = 1) => {
    try {
      setLoading(true);
      const res = await fetchComments(parentId, pageParam, limit);
      setTotalPages(res.pagination.totalPages);

      if (pageParam === 1) {
        setComments(res.data);
      } else {
        setComments((prev) => [...prev, ...res.data]);
      }
    } catch (error) {
      toast.error('Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  };

  const loadReplies = async (commentId: string, pageParam = 1) => {
    try {
      const res = await fetchReplies(commentId, pageParam, 5);
      const newReplies = res.data;

      setReplyMap((prev) => ({
        ...prev,
        [commentId]: pageParam === 1 ? newReplies : [...(prev[commentId] || []), ...newReplies],
      }));

      setExpanded((prev) => ({ ...prev, [commentId]: true }));
      setReplyPage((prev) => ({ ...prev, [commentId]: pageParam }));
      setHasMoreReplies((prev) => ({
        ...prev,
        [commentId]: pageParam < res.pagination.totalPages,
      }));
    } catch (error) {
      console.error('Failed to load replies', error);
    }
  };

  // Add comment or reply
  const onSubmit = async (message: string, parentCommentId?: string) => {
    if (!message.trim()) return toast.error('Please write something');

    try {
      if (parentCommentId) {
        const reply: ReplyComment = {
          parentId,
          parentType,
          parentCommentId,
          text: message,
        };
        const res = await addReply(reply);

        // Make sure replies section opens
        setExpanded((prev) => ({ ...prev, [parentCommentId]: true }));
        loadReplies(parentCommentId, 1);

        setReplyText('');
        setReplyingTo(null);
      } else {
        const newComment = await addComment({ parentId, parentType, text: message });

        // Add new comment at top
        setComments((prev) => [
          {
            ...newComment.data,
            user: {
              _id: currentUser?._id,
              username: currentUser?.username,
              profileImage: currentUser?.profileImage?.url || '/profile-default.jpg',
            },
          },
          ...prev,
        ]);
        setText('');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error posting comment');
    }
  };

  // Delete comment/reply
  const handleDelete = async (commentId: string, parentCommentId?: string) => {
    try {
      await deleteComment(commentId);
      if (parentCommentId) {
        setReplyMap((prev) => ({
          ...prev,
          [parentCommentId]: prev[parentCommentId]?.filter((r) => r._id !== commentId) || [],
        }));
      } else {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
      }
      toast.success('Deleted successfully');
    } catch {
      toast.error('Something went wrong');
    }
  };

  const { loadMore, hasMore, loadingPage } = useLoadMore({
    totalPages,
    onLoad: loadComments,
  });

  const options = [{ label: 'Delete', value: 'delete', className: 'text-red-500' }];

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-t-2xl">
      {/* Comment List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-5 scrollbar-thin scrollbar-thumb-gray-300">
        {comments.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center text-gray-400 text-sm h-full">
            <p>No comments yet.</p>
            <p>Be the first to share your thoughts!</p>
          </div>
        )}

        <AnimatePresence>
          {comments.map((comment) => {
            const isOwner = currentUser?._id === comment.user?._id;
            const replyCount = comment.replyCount || 0;

            return (
              <motion.div
                key={comment._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-3"
              >
                <img
                  src={comment.user?.profileImage || '/profile-default.jpg'}
                  alt="user"
                  className="w-9 h-9 rounded-full object-cover"
                />

                <div className="flex-1">
                  <div className="bg-gray-50 rounded-2xl px-3 py-2 relative">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">{comment.user?.username}</span>
                        <span className="text-sm text-darkText">{comment.text}</span>
                      </div>
                      {isOwner && (
                        <OptionsDropdown
                          options={options}
                          onSelect={() => handleDelete(comment._id)}
                        />
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="text-xs text-muted-foreground flex gap-3 mt-1 pl-2 items-center">
                    <button
                      onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                      className="hover:underline"
                    >
                      Reply
                    </button>

                    {replyCount > 0 && (
                      <button
                        onClick={() => {
                          if (!expanded[comment._id]) loadReplies(comment._id, 1);
                          else setExpanded((prev) => ({ ...prev, [comment._id]: false }));
                        }}
                        className="hover:underline"
                      >
                        {expanded[comment._id] ? 'Hide replies' : `View replies (${replyCount})`}
                      </button>
                    )}

                    <span className="ml-auto text-gray-400">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Reply Input */}
                  {replyingTo === comment._id && (
                    <div className="pl-6 mt-2 flex items-center gap-2">
                      <img
                        src={currentUser?.profileImage?.url || '/profile-default.jpg'}
                        alt="User"
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <input
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a reply..."
                        className="flex-1 bg-gray-100 rounded-full px-3 py-1.5 text-sm focus:outline-none"
                      />
                      <button
                        onClick={() => onSubmit(replyText, comment._id)}
                        className="text-orange font-semibold text-sm"
                      >
                        Reply
                      </button>
                    </div>
                  )}

                  {/* Replies */}
                  {expanded[comment._id] && (
                    <div className="pl-6 mt-2 space-y-2">
                      {replyMap[comment._id]?.map((reply) => {
                        const isReplyOwner = currentUser?._id === reply.user?._id;
                        return (
                          <motion.div
                            key={reply._id}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-2"
                          >
                            <img
                              src={reply.user?.profileImage || '/profile-default.jpg'}
                              alt="reply-user"
                              className="w-7 h-7 rounded-full object-cover"
                            />
                            <div className="bg-gray-100 rounded-2xl px-3 py-1.5 flex-1">
                              <div className="flex justify-between items-start">
                                <span className="font-semibold text-sm mr-2">
                                  {reply.user?.username}
                                </span>
                                {isReplyOwner && (
                                  <OptionsDropdown
                                    options={options}
                                    onSelect={() => handleDelete(reply._id, comment._id)}
                                  />
                                )}
                              </div>
                              <span className="text-sm">{reply.text}</span>
                            </div>
                          </motion.div>
                        );
                      })}

                      {/* Load more replies */}
                      {hasMoreReplies[comment._id] && (
                        <button
                          onClick={() =>
                            loadReplies(comment._id, (replyPage[comment._id] || 1) + 1)
                          }
                          className="text-xs text-orange font-semibold mt-1"
                        >
                          Load more replies
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {loading && (
          <p className="text-center text-xs text-muted-foreground py-2">Loading comments...</p>
        )}

        {!loading && hasMore && (
          <button
            onClick={loadMore}
            className="text-sm text-orange font-semibold mt-2 w-full hover:text-orange/80"
          >
            Load more comments
          </button>
        )}
      </div>

      {/* Main Comment Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(text);
        }}
        className="border-t px-4 py-3 flex items-center gap-3"
      >
        <img
          src={currentUser?.profileImage?.url || '/profile-default.jpg'}
          alt="User"
          className="w-8 h-8 rounded-full object-cover"
        />
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none"
        />
        <button type="submit" className="text-orange font-semibold text-sm hover:text-orange/80">
          Post
        </button>
      </form>
    </div>
  );
};

export default CommentSection;
