import { Heart, MoreHorizontal, Verified } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css';
import type { IBlog } from '@/types/IBlog';
import { Button } from '@/components/Button';

interface BlogDetailCardProps {
  blog: IBlog;
  likesCount: number;
  onDelete?: () => void;
  onToggleBlock?: () => void;
}

const BlogDetailCard = ({ blog, likesCount, onDelete, onToggleBlock }: BlogDetailCardProps) => {
  const formatNumber = (num: number) =>
    num >= 1000 ? (num / 1000).toFixed(1) + 'k' : num.toString();
  console.log(blog, 'blog');
  return (
    <article className="bg-white shadow-md rounded-xl overflow-hidden max-w-3xl mx-auto">
      {/* Admin Actions */}
      <div className="flex gap-2 p-4">
        {onDelete && (
          <Button
            className="px-4 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            onClick={onDelete}
          >
            Delete
          </Button>
        )}
        {onToggleBlock && (
          <Button onClick={onToggleBlock}>{blog.isBlocked ? 'Unblock' : 'Block'}</Button>
        )}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-3">
          <img
            src={blog.author?.profileImage?.url || '/profile-default.jpg'}
            alt={blog.author?.username}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-orange/30"
          />
          <div>
            <div className="flex items-center space-x-1">
              <span className="text-sm font-semibold text-darkText">{blog.author?.username}</span>
              <Verified className="w-4 h-4 text-orange" />
            </div>
          </div>
        </div>
        <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
      </div>

      {/* Images */}
      {blog.images?.length! > 0 && (
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          modules={[Navigation, Pagination]}
          className="w-full"
        >
          {blog.images!.map((img, index) => (
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
        {/* Likes */}
        <div className="text-sm font-semibold text-darkText mb-2">
          <Heart />
          {formatNumber(likesCount)} likes
        </div>

        {/* Content */}
        <div className="mb-3">
          <span className="font-semibold text-sm text-darkText mr-2">{blog.author?.username}</span>
          <span className="text-lg text-darkText">{blog.title}</span>
          <br />
          <span className="text-sm text-darkText">{blog.content}</span>
        </div>

        {/* Tags */}
        {blog.tags!.length > 0 && (
          <div className="mb-2">
            <span className="text-sm text-orange">
              {blog.tags!.map((tag, i) => (
                <span key={i} className="mr-2">
                  #{tag}
                </span>
              ))}
            </span>
          </div>
        )}

        {/* Date */}
        <div className="text-xs text-muted-foreground uppercase tracking-wide">
          {new Date(blog.createdAt!).toLocaleDateString()}
        </div>
      </div>
    </article>
  );
};

export default BlogDetailCard;
