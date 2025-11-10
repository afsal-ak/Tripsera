import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Heart, Calendar, User, ArrowLeft, Flag } from 'lucide-react';
import {
  fetchBlogBySlug,
  handleLikeBlog,
  handleUnLikeBlog,
  fetchBlogLikeList,
} from '@/services/user/blogService';
import type { IBlog } from '@/types/IBlog';
import type { UserBasicInfo } from '@/types/UserBasicInfo';
import CommentSection from '@/components/CommentSection';
import UserList from '@/components/UserList';
import ReportForm from '../report/ReportForm';
import type { IReportedType, ISelectedReport } from '@/types/IReport';
import Modal from '@/components/ui/Model';
const BlogDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [blogData, setBlogData] = useState<IBlog>();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [likedUsers, setLikedUsers] = useState<UserBasicInfo[]>([]);
  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);

  const [selectedReport, setSelectedReport] = useState<ISelectedReport | null>(null);
  const [showReportModal, setShowReportModal] = useState(true);
  const [showCommentModal, setShowCommentModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadBlogDetail = async () => {
      if (!slug) return;
      try {
        const response = await fetchBlogBySlug(slug);
        setBlogData(response.blog);
        setLiked(response.blog?.isLiked || false);
        setLikesCount(response.blog?.likes?.length || 0);
        if (response.blog?._id) {
          const likesResponse = await fetchBlogLikeList(response.blog._id);
          setLikedUsers(likesResponse);
        }
      } catch (error: any) {
        console.error('Failed to fetch blog details', error);
      }
    };
    loadBlogDetail();
  }, [slug]);

  const toggleLike = async () => {
    if (!blogData?._id) return;
    try {
      if (liked) {
        await handleUnLikeBlog(blogData._id);
        setLiked(false);
        setLikesCount((prev) => prev - 1);
      } else {
        await handleLikeBlog(blogData._id);
        setLiked(true);
        setLikesCount((prev) => prev + 1);
      }
    } catch {
      toast.error('Something went wrong');
    }
  };
 
  
const handleReportClick = () => {
  if (blogData?._id) {
    setSelectedReport({
      _id: blogData._id,
      reportedType: 'blog',
    });
    setShowReportModal(true);
  }
};

  return (
    <div className="relative max-w-[90vw] mx-auto mt-6 rounded-2xl overflow-hidden  ">
      {/* ====== COVER IMAGE CONTAINER ====== */}
      {/*  */}{/* ====== COVER IMAGE FULL WIDTH ====== */}
    <div className="relative w-full h-[75vh]">
  <img
    src={blogData?.coverImage.url}
    alt={blogData?.title}
    className="absolute inset-0 w-full h-full object-cover"
  />

  {/* Dark overlay */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

  {/* Back button */}
  <div className="absolute top-4 left-4">
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 bg-black/40 hover:bg-black/60 text-white px-3 py-1.5 rounded-full transition"
    >
      <ArrowLeft size={16} />
      Back
    </button>
  </div>

  {/* BLOG INFO + ACTIONS */}
  <div className="absolute bottom-10 left-10 text-white space-y-4 max-w-3xl">
    <motion.h1
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-5xl font-bold leading-tight drop-shadow-md break-words"
    >
      {blogData?.title}
    </motion.h1>

    {/* AUTHOR + DATE */}
    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-200">
      {blogData?.author && (
        <Link
          to={`/profile/${blogData.author.username}`}
          className="flex items-center gap-2 hover:underline hover:text-white"
        >
          <img
            src={blogData.author?.profileImage?.url || '/default-avatar.png'}
            alt={blogData.author.username}
            className="w-8 h-8 rounded-full object-cover border border-white"
          />
          <span>{blogData.author.username}</span>
        </Link>
      )}
      <div className="flex items-center gap-2">
        <Calendar size={16} />
        <span>{new Date(blogData?.createdAt!).toDateString()}</span>
      </div>
    </div>

    {/* LIKE + REPORT BUTTONS */}
    <div className="flex items-center gap-3 mt-4 flex-wrap">
      {/* Like Button */}
      <button
        onClick={toggleLike}
        className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full text-white transition"
      >
        <Heart
          size={18}
          className={liked ? 'fill-red-500 text-red-500' : 'text-white'}
        />
        <span>{likesCount} Likes</span>
      </button>

      <button
        onClick={() => setIsLikesModalOpen(true)}
        className="text-sm underline hover:text-gray-300"
      >
        View liked users
      </button>

      {/*   Report Button */}
    <button
  onClick={handleReportClick}
  className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/40 px-4 py-2 rounded-full text-red-300 transition"
>
  <Flag size={16} />
  <span>Report</span>
</button>

    </div>
  </div>
</div>


      {/* ====== MAIN CONTENT ====== */}
      <div className="max-w-4xl mx-auto p-6 space-y-12">
        {/* Overview */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-lg leading-relaxed text-muted-foreground text-justify break-words">
            {blogData?.overview}
          </p>
        </motion.section>

        {/* Blog Sections */}
        {blogData?.sections?.map((section, index) => (
          <motion.section
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className={`flex flex-col md:flex-row ${index % 2 === 1 ? 'md:flex-row-reverse' : ''
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
              <h2 className="text-2xl font-semibold break-words">
                {section.heading}
              </h2>
              <p className="text-muted-foreground leading-relaxed text-justify break-words whitespace-pre-line">
                {section.content}
              </p>
            </div>
          </motion.section>
        ))}

        {/* Tags */}
        {blogData?.tags?.length ? (
          <section className="flex flex-wrap gap-2">
            {blogData.tags.map((tag) => (
              <span
                key={tag}
                className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </section>
        ) : null}

        {/* Divider */}
        <hr className="border-gray-300 dark:border-gray-700 my-8" />

        {/* Comments */}
        {blogData?._id && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-card rounded-2xl shadow-md p-6"
          >
            <h3 className="text-2xl font-semibold mb-6 border-b pb-3">
              Comments
            </h3>
            <CommentSection parentId={blogData._id} parentType="blog" />
          </motion.section>
        )}
      </div>
      {showReportModal && selectedReport && (
        <Modal onClose={() => setShowReportModal(false)}>
          <ReportForm
            id={selectedReport._id}
            status={selectedReport.reportedType}
            onSuccess={() => setShowReportModal(false)}
          />
        </Modal>
      )}
      {/* ====== LIKED USERS MODAL ====== */}
      <UserList
        title="Liked by"
        users={likedUsers}
        isOpen={isLikesModalOpen}
        onClose={() => setIsLikesModalOpen(false)}
      />
    </div>
  );
};

export default BlogDetailPage;
