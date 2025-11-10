import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Heart, Trash2, Ban, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import type { IBlog } from '@/types/IBlog';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

type Props = {
  blog: IBlog;
  likesCount: number;
  onDelete: () => void;
  onToggleBlock: () => void;
};

const BlogDetailCard = ({ blog, likesCount, onDelete, onToggleBlock }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="relative max-w-[90vw] mx-auto mt-6 rounded-2xl overflow-hidden">
      {/* ====== COVER IMAGE FULL ====== */}
      <div className="relative w-full h-[75vh]">
        <img
          src={blog?.coverImage?.url}
          alt={blog?.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Back Button */}
        <div className="absolute top-4 left-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-black/40 hover:bg-black/60 text-white px-3 py-1.5 rounded-full transition"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>

        {/* ====== ADMIN ACTION BUTTONS ====== */}
        <div className="absolute top-4 right-4 flex gap-3">
          <ConfirmDialog
            title={`Are you sure you want to ${blog.isBlocked ? 'unblock' : 'block'} this blog?`}
            actionLabel={blog.isBlocked ? 'Unblock' : 'Block'}
            onConfirm={onToggleBlock}
          >
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-white transition ${
                blog?.isBlocked
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {blog?.isBlocked ? (
                <>
                  <CheckCircle size={16} /> Unblock
                </>
              ) : (
                <>
                  <Ban size={16} /> Block
                </>
              )}
            </button>
          </ConfirmDialog>

          <ConfirmDialog
            title="Are you sure you want to delete this blog?"
            actionLabel="Delete"
            onConfirm={onDelete}
          >
            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-700 hover:bg-red-800 text-white transition">
              <Trash2 size={16} /> Delete
            </button>
          </ConfirmDialog>
        </div>

        {/* ====== BLOG TITLE + META ====== */}
        <div className="absolute bottom-10 left-10 text-white space-y-4 max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold leading-tight drop-shadow-md break-words"
          >
            {blog?.title}
          </motion.h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-200">
            {blog?.author && (
              <Link
                to={`/admin/users/${blog.author._id}`}
                className="flex items-center gap-2 hover:underline hover:text-white"
              >
                <img
                  src={blog.author?.profileImage?.url || '/default-avatar.png'}
                  alt={blog.author.username}
                  className="w-8 h-8 rounded-full object-cover border border-white"
                />
                <span>{blog.author.username}</span>
              </Link>
            )}
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{new Date(blog?.createdAt!).toDateString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-white">
              <Heart size={18} className="text-red-500 fill-red-500" />
              <span>{likesCount} Likes</span>
            </div>
          </div>
        </div>
      </div>

      {/* ====== BLOG CONTENT ====== */}
      <div className="max-w-4xl mx-auto p-6 space-y-12">
        <p className="text-lg leading-relaxed text-muted-foreground text-justify break-words">
          {blog?.overview}
        </p>

        {blog?.sections?.map((section, index) => (
          <motion.section
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className={`flex flex-col md:flex-row ${
              index % 2 === 1 ? 'md:flex-row-reverse' : ''
            } items-center gap-8`}
          >
            <div className="md:w-1/2">
              <img
                src={section?.image?.url}
                alt={section.heading}
                className="rounded-3xl shadow-lg object-cover w-full h-[400px]"
              />
            </div>
            <div className="md:w-1/2 space-y-3">
              <h2 className="text-2xl font-semibold break-words">{section.heading}</h2>
              <p className="text-muted-foreground leading-relaxed text-justify break-words whitespace-pre-line">
                {section.content}
              </p>
            </div>
          </motion.section>
        ))}

        {blog?.tags?.length ? (
          <section className="flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </section>
        ) : null}
      </div>
    </div>
  );
};

export default BlogDetailCard;
