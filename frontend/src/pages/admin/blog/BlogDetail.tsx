import { useEffect, useState } from 'react';
import { fetchBlogById, deleteBlogAdmin, changeBlogStatus } from '@/services/admin/blogService';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type { IBlog } from '@/types/IBlog';
import BlogDetailCard from './BlogDetailCard';
const BlogDetail = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const [blogData, setBlogData] = useState<IBlog | null>(null);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const loadBlogDetail = async () => {
      if (!blogId) return;
      try {
        const response = await fetchBlogById(blogId);
        setBlogData(response.blog);
        setLikesCount(response.blog?.likes?.length || 0);
      } catch {
        toast.error('Failed to fetch blog details');
      }
    };
    loadBlogDetail();
  }, [blogId]);

  const handleDelete = async () => {
    if (!blogId) return;
    try {
      await deleteBlogAdmin(blogId);
      toast.success('Blog deleted successfully');
      navigate('/admin/blogs');
    } catch {
      toast.error('Failed to delete blog');
    }
  };

  const handleBlockToggle = async () => {
    if (!blogData?._id) return;
    try {
      await changeBlogStatus(blogData._id, !blogData.isBlocked);
      toast.success(`Blog has been ${!blogData.isBlocked ? 'blocked' : 'unblocked'}`);
      navigate('/admin/blogs');
    } catch {
      toast.error('Failed to change blog status');
    }
  };

  return blogData ? (
    <BlogDetailCard
      blog={blogData}
      likesCount={likesCount}
      onDelete={handleDelete}
      onToggleBlock={handleBlockToggle}
    />
  ) : null;
};

export default BlogDetail;
