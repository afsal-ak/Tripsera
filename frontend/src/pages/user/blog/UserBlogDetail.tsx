import { useEffect, useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark, Verified, } from 'lucide-react';
import {
  fetchBlogBySlug,
  handleLikeBlog,
  handleUnLikeBlog,
  handleBlogEdit,
  handleDeleteBlog,
  fetchBlogLikeList
} from '@/services/user/blogService';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import type { IBlog } from '@/types/IBlog';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css';
import { Navigation, Pagination } from 'swiper/modules';
import { OptionsDropdown } from '@/components/OptionsDropdown ';
import ReportForm from '../report/ReportForm';
import type { IReportedType, ISelectedReport } from '@/types/IReport';
import Modal from '@/components/ui/Model';
import UserList from '@/components/UserList';
import type { UserBasicInfo } from '@/types/UserBasicInfo';
import CommentModal from '@/components/CommentModal';
const UserBlogDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate()
  //console.log(slug, 'from param');
  const [liked, setLiked] = useState(false);
  // const [savedPosts, setSavedPosts] = useState();
  const [blogData, setBlogData] = useState<IBlog | null>(null);
  const [likesCount, setLikesCount] = useState(0);
  const [likedUsers, setLikedUsers] = useState<UserBasicInfo[]>([]);
  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);

  const [selectedReport, setSelectedReport] = useState<ISelectedReport | null>(null)
  const [showReportModal, setShowReportModal] = useState(true);
  const [showCommentModal, setShowCommentModal] = useState(false);

  useEffect(() => {
    const loadBlogDetail = async () => {
      if (!slug) return;

      try {
        const response = await fetchBlogBySlug(slug);
        console.log(response, 'response fr')
        setBlogData(response.blog);
        setLiked(response.blog?.isLiked || false);
        setLikesCount(response.blog?.likes?.length || 0);
        if (response.blog?._id) {
          console.log(response.blog._id, 'llllll')

          const likesResponse = await fetchBlogLikeList(response.blog._id);
          setLikedUsers(likesResponse)
          console.log(likesResponse, 'blog likes');
        }
      } catch (error: any) {
        console.error('Failed to fetch blog details', error);
      }
    };

    loadBlogDetail();
  }, [slug]);
  const handleDelete = async () => {
    if (!blogData?._id) {
      return;
    }
    try {
      await handleDeleteBlog(blogData._id);
      navigate('/account/my-blogs');
      toast.success('blog deleted successfully');
    } catch (error: any) {
      toast.error('Failed to unlike post');
    }
  };

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
    } catch (error: unknown) {
      console.error('Like/Unlike failed', error);
      toast.error('Please log in');
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const handleNavigateUseProfile = (username: string) => {
    navigate(`/profile/${username}`)
  }
  const options = [
    { label: "Edit", value: "edit", className: "text-black-500" },
    { label: "Delete", value: "delete", className: "text-red-500" },
    // { label: "Delete", value: "delete" },
    // { label: "Block User", value: "block" },
  ];


  function handleOptionSelect(value: string, _id: string, reportedType: IReportedType) {
    console.log("Selected option:", value);
    // Add your logic here based on value
    if (value == 'delete') {
      handleDelete()
    } else if (value === 'edit') {

      navigate(`/account/my-blogs/edit/${blogData?._id}`)

    }
  }
  return (
    <div className="min-h-screen bg-bg px-4 py-6">
      {blogData && (
        <article className="bg-white shadow-md rounded-xl overflow-hidden max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div onClick={() => handleNavigateUseProfile(blogData.author.username)} className="flex items-center space-x-3">
              <img
                src={blogData.author?.profileImage?.url || '/profile-default.jpg'}
                alt={blogData.author?.username}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-orange/30"
              />
              <div>
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-semibold text-darkText">
                    {blogData.author?.username}
                  </span>
                  <Verified className="w-4 h-4 text-orange" />
                </div>
                {/* {blogData.location && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3 mr-1" />
                    {blogData.location}
                  </div>
                )} */}
              </div>
            </div>
            <OptionsDropdown options={options} onSelect={(value) => handleOptionSelect(value, blogData?._id!, 'blog')} />
          </div>

          {/* Images */}
          {blogData.images?.length! > 0 && (
            <Swiper
              spaceBetween={10}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              modules={[Navigation, Pagination]}
              className="w-full"
            >
              {blogData.images!.map((img, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={img.url}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-[400px] object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}

          {/* Actions */}
          <div className="p-4">
            <div className="flex justify-between mb-2">
              <div className="flex items-center space-x-4">
                <button onClick={toggleLike}>
                  <Heart
                    className={`w-6 h-6 transition-all duration-200 ${liked
                      ? 'fill-red-500 text-red-500'
                      : 'text-darkText hover:text-muted-foreground'
                      }`}
                  />
                </button>

                {/* <MessageCircle className="w-6 h-6 text-darkText hover:text-muted-foreground" /> */}
                <button onClick={() => setShowCommentModal(true)}>
                  <MessageCircle className="w-6 h-6 text-darkText hover:text-muted-foreground" />
                </button>

                <Send className="w-6 h-6 text-darkText hover:text-muted-foreground" />
              </div>
              <Bookmark className="w-6 h-6 text-darkText hover:text-muted-foreground" />
            </div>

            {/* Likes */}
            <div
              className="text-sm font-semibold text-darkText mb-2 cursor-pointer hover:underline"
              onClick={() => setIsLikesModalOpen(true)}
            >
              {formatNumber(likesCount)} likes
            </div>

            <UserList
              title="Liked by"
              users={likedUsers}
              isOpen={isLikesModalOpen}
              onClose={() => setIsLikesModalOpen(false)}
            />
            {showCommentModal && (
              <Modal onClose={() => setShowCommentModal(false)}>
                <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="flex justify-between items-center p-3 border-b">
                    <h2 className="text-lg font-semibold">Comments</h2>
                    <button
                      onClick={() => setShowCommentModal(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                  {/* <div className="max-h-[70vh] overflow-y-auto">
        <CommentSection
          parentId={blogData._id!}
          parentType="blog"
          // pass logged-in user if available
        />
      </div> */}

                </div>
              </Modal>
            )}

            {/* Content */}
            <div className="mb-3">
              <span className="font-semibold text-sm text-darkText mr-2">
                {blogData.author?.username}
              </span>
              <span className="text-lg text-darkText">{blogData.title}</span>
              <br />

              <span className="text-sm text-darkText">{blogData.content}</span>
            </div>

            {/* Tags */}
            {blogData.tags!.length > 0 && (
              <div className="mb-2">
                <span className="text-sm text-orange">
                  {blogData.tags!.map((tag, i) => (
                    <span key={i} className="mr-2">
                      #{tag}
                    </span>
                  ))}
                </span>
              </div>
            )}

            {/* Date */}
            <div className="text-xs text-muted-foreground uppercase tracking-wide">
              {new Date(blogData?.createdAt!).toLocaleDateString()}
            </div>
          </div>
          <CommentModal
            isOpen={showCommentModal}
            onClose={() => setShowCommentModal(false)}
            imageUrl={blogData.images!?.[0]?.url}
            parentId={blogData._id!}
            parentType="blog"
          />
          {/* Comments Modal */}

        </article>
      )}
      {showReportModal && selectedReport && (
        <Modal onClose={() => setShowReportModal(false)}>
          <ReportForm
            id={selectedReport._id}
            status={selectedReport.reportedType}
            onSuccess={() => setShowReportModal(false)}
          />
        </Modal>
      )}

    </div>
  );
};

export default UserBlogDetails;
