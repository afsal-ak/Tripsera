import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Heart, Calendar, User, ArrowLeft, Flag, Loader2 } from 'lucide-react';
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
import { useAuthModal } from '@/context/AuthModalContext';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import ProtectedLink from '@/components/ProtectedLink';
 import { useQuery } from '@tanstack/react-query';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { openLogin } = useAuthModal();

  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.userAuth
  );

  const [loading, setLoading] = useState(true);
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

  // useEffect(() => {
  //   const loadBlogDetail = async () => {
  //     if (!slug) return;
  //     try {
  //             setLoading(true);

  //       const response = await fetchBlogBySlug(slug);
  //       setBlogData(response.blog);
  //       setLiked(response.blog?.isLiked || false);
  //       setLikesCount(response.blog?.likes?.length || 0);
  //       if (response.blog?._id) {

  //         const likesResponse = await fetchBlogLikeList(response.blog._id);
  //         setLikedUsers(likesResponse);
  //       }
  //     } catch (error: any) {
  //       console.error('Failed to fetch blog details', error);
  //     }finally {
  //     setLoading(false);
  //   }
  //   };
  //   loadBlogDetail();
  // }, [slug]);

  const toggleLike = async () => {
    if (!blogData?._id) return;

    const isAllowed = isAuthenticated && !user?.isBlocked;

    if (!isAllowed) {
      openLogin(); //  open modal
      return;      //  stop navigation
    }
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


const { data, isLoading } = useQuery({
  queryKey: ['blog', slug],
  queryFn: () => fetchBlogBySlug(slug!),
  enabled: !!slug,
  staleTime: 1000 * 60 * 5, // 5 min cache
});
useEffect(() => {
  if (data?.blog) {
    setBlogData(data.blog);
    setLiked(data.blog?.isLiked || false);
    setLikesCount(data.blog?.likes?.length || 0);
  }
}, [data]);

  const handleReportClick = () => {
    const isAllowed = isAuthenticated && !user?.isBlocked;

    if (!isAllowed) {
      openLogin(); //  open modal
      return;      //  stop navigation
    }
    if (blogData?._id) {
      setSelectedReport({
        _id: blogData._id,
        reportedType: 'blog',
      });
      setShowReportModal(true);
    }
  };

  const LazyComments = ({ parentId }: { parentId: string }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(true); // load after render
    }, 500); // delay for smooth UX

    return () => clearTimeout(timeout);
  }, []);

  if (!show) {
    return <p className="text-sm text-gray-400">Loading comments...</p>;
  }

  return <CommentSection parentId={parentId} parentType="blog" />;
};
if (isLoading) {
      return <div className="h-screen flex items-center justify-center"><Loader2/></div>;

}
  return (
    <div className="relative max-w-[90vw] mx-auto mt-6 rounded-2xl overflow-hidden  ">
      {/* ====== COVER IMAGE CONTAINER ====== */}
      {/*  */}{/* ====== COVER IMAGE FULL WIDTH ====== */}
      <div className="relative w-full h-[260px] sm:h-[350px] md:h-[75vh] rounded-xl overflow-hidden bg-white flex items-center justify-center">

  {/* 🔥 Blur Background */}
  <img
    src={blogData?.coverImage?.url}
    alt="blur"
    className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-70"
  />

  {/* ✅ Main Image (NO CROP on mobile) */}
  <img
    src={blogData?.coverImage?.url?.replace('/upload/', '/upload/f_webp,q_auto/')}
    alt={blogData?.title}
    loading="eager"
    className="
      relative z-10 
      w-full h-full 
      object-contain sm:object-cover 
      transition-all duration-500
    "
  />

  {/* Overlay */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />

  {/* 🔙 Back Button */}
  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20">
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 bg-black/40 hover:bg-black/60 text-white px-3 py-1.5 rounded-full text-sm"
    >
      <ArrowLeft size={16} />
      Back
    </button>
  </div>

  {/* 🧠 CONTENT + ACTIONS */}
  <div className="absolute bottom-4 sm:bottom-10 left-4 sm:left-10 right-4 z-20 text-white space-y-3 sm:space-y-4 max-w-3xl">

    {/* Title */}
    <h1 className="text-lg sm:text-3xl md:text-5xl font-bold leading-tight break-words">
      {blogData?.title}
    </h1>

    {/* Author + Date */}
    <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-200">
      {blogData?.author && (
        <ProtectedLink
          to={`/profile/${blogData.author.username}`}
          requireAuth
          className="flex items-center gap-2"
        >
          <img
            src={blogData.author?.profileImage?.url || '/profile-default.jpg'}
            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover"
          />
          <span>{blogData.author.username}</span>
        </ProtectedLink>
      )}

      <div className="flex items-center gap-2">
        <Calendar size={14} />
        <span>{new Date(blogData?.createdAt!).toDateString()}</span>
      </div>
    </div>

    {/* ❤️ ACTION BUTTONS */}
    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2">

      {/* Like */}
      <button
        onClick={toggleLike}
        className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm"
      >
        <Heart
          size={16}
          className={liked ? 'fill-red-500 text-red-500' : 'text-white'}
        />
        <span>{likesCount}</span>
      </button>

      {/* View Likes */}
      <button
        onClick={() => setIsLikesModalOpen(true)}
        className="text-xs sm:text-sm underline hover:text-gray-300"
      >
        View likes
      </button>

      {/* Report */}
      <button
        onClick={handleReportClick}
        className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/40 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-red-300 text-xs sm:text-sm"
      >
        <Flag size={14} />
        Report
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
  <motion.section className="bg-white rounded-2xl shadow-md p-6">
    <h3 className="text-2xl font-semibold mb-6 border-b pb-3">
      Comments
    </h3>

    <LazyComments parentId={blogData._id} />
  </motion.section>
)}
        {/* {blogData?._id && (
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
        )} */}
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
