import { useEffect, useState } from 'react';
import { MessageCircle, Send, Bookmark, MoreHorizontal, Verified } from 'lucide-react';
import {
  fetchBlogById,
  deleteBlogAdmin,
  changeBlogStatus,
} from '@/features/services/admin/blogService';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type { IBlog } from '@/features/types/IBlog';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css';
import { Navigation, Pagination } from 'swiper/modules';
import { Button } from '@/features/components/Button';

const BlogDetail = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  console.log(blogId, 'from param');
  // const [savedPosts, setSavedPosts] = useState();
  const [blogData, setBlogData] = useState<IBlog | null>(null);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const loadBlogDetail = async () => {
      if (!blogId) return;

      try {
        const response = await fetchBlogById(blogId);
        setBlogData(response.blog);
        setLikesCount(response.blog?.likes?.length || 0);
      } catch (error) {
        console.error('Failed to fetch blog details', error);
      }
    };

    loadBlogDetail();
  }, [blogId]);

  const handleDelete = async () => {
    if (!blogId) {
      return;
    }
    try {
      await deleteBlogAdmin(blogId);
      navigate('/admin/blogs');
      toast.success('blog deleted successfully');
    } catch (error: any) {
      toast.error('Failed to unlike post');
    }
  };

  const handleBlockToggle = async (blogId: string, currentBlocked: boolean) => {
    try {
      await changeBlogStatus(blogId, !currentBlocked);
      toast.success(`Blog has been ${!currentBlocked ? 'blocked' : 'unblocked'}`);
      navigate('/admin/blogs');
      // Refresh list or update state here
    } catch (error) {
      toast.error('Failed to change blog status');
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };
  //   const image = blogData?.images?.url!.replace("/upload/", "/upload/f_auto,q_auto/") || "";
  return (
    <div className="min-h-screen bg-bg px-4 py-6">
      <Button
        className="px-4 py-1 text-sm ml-96 bg-red-500 text-white rounded hover:bg-red-600"
        onClick={handleDelete}
      >
        Delete
      </Button>
      <Button onClick={() => handleBlockToggle(blogData?._id!, blogData?.isBlocked!)}>
        {blogData?.isBlocked ? 'Unblock' : 'Block'}
      </Button>

      {blogData && (
        <article className="bg-white shadow-md rounded-xl overflow-hidden max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-3">
              <img
                src={blogData.author?.profileImage?.url}
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
            <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
          </div>

          {/* Images */}
          {blogData.images?.length > 0 && (
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
                <MessageCircle className="w-6 h-6 text-darkText hover:text-muted-foreground" />
                <Send className="w-6 h-6 text-darkText hover:text-muted-foreground" />
              </div>
              <Bookmark className="w-6 h-6 text-darkText hover:text-muted-foreground" />
            </div>

            {/* Likes */}
            <div className="text-sm font-semibold text-darkText mb-2">
              {formatNumber(likesCount)} likes
            </div>

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
        </article>
      )}
    </div>
  );
};

export default BlogDetail;
