 import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { IBlog } from "@/features/types/IBlog";
import { usePaginationButtons } from "@/features/hooks/usePaginationButtons";

type Props = {
  posts: IBlog[];
  totalBlogs: number;
  currentPage: number;
  limit: number;
  onPageChange: (page: number) => void;
};

const ProfileGallery = ({
  posts,
  totalBlogs,
  currentPage,
  limit,
  onPageChange,
}: Props) => {
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {posts.map((post) => (
          <div
            key={post._id}
            onClick={() => handleClick(post.slug!)}
            className="relative group aspect-square overflow-hidden rounded-md cursor-pointer"
          >
            <img
              src={post.images?.[0]?.url.replace(
                "/upload/",
                "/upload/f_auto,q_auto/"
              )}
              alt="Post"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center space-x-4 transition-opacity duration-200">
              <div className="flex items-center text-white">
                <Heart className="h-6 w-6 mr-2" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
        {paginationButtons}
      </div>
    </div>
  );
};

export default ProfileGallery;
