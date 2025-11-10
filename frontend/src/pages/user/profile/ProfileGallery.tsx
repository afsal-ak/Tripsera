import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { IBlog } from '@/types/IBlog';
import { usePaginationButtons } from '@/hooks/usePaginationButtons';

type Props = {
  posts: IBlog[];
  totalBlogs: number;
  currentPage: number;
  limit: number;
  onPageChange: (page: number) => void;
};

const ProfileGallery = ({ posts, totalBlogs, currentPage, limit, onPageChange }: Props) => {
  const navigate = useNavigate();

  const totalPages = Math.ceil(totalBlogs / limit);

  const paginationButtons = usePaginationButtons({
    currentPage,
    totalPages,
    onPageChange,
  });

  const handleClick = (slug: string) => {
    navigate(`/blog/${slug}`);
  };

  return (
    <div className="mt-6 mb-12">
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post._id}
            onClick={() => handleClick(post.slug!)}
            className="relative group overflow-hidden rounded-xl cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            {/* Image container with 16:9 aspect ratio */}
            <div className="relative aspect-video overflow-hidden">
              <img
                src={post.coverImage?.url.replace('/upload/', '/upload/f_auto,q_auto/')}
                alt={post.title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />

              {/* Overlay gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Overlay Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-lg font-semibold truncate">{post.title}</h3>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-200">
                  <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                  <span>{post.likes?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
        {paginationButtons}
      </div>
    </div>
  );
};

export default ProfileGallery;
