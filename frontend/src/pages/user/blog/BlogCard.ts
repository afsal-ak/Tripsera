// import { Calendar, ArrowRight, User, Tag } from 'lucide-react';
// import type{ IBlog } from '@/types/IBlog';
// interface BlogCardProps {
//   blog: IBlog;
//   onClick?: (blog: IBlog) => void;
// }

// const BlogCard = ({ blog, onClick }: BlogCardProps) => {
//   const formatDate = (date?: Date) => {
//     if (!date) return 'Recent';
//     const d = new Date(date);
//     return d.toLocaleDateString('en-US', { 
//       year: 'numeric', 
//       month: 'short', 
//       day: 'numeric' 
//     });
//   };

//   const getReadTime = (content: string) => {
//     const wordsPerMinute = 200;
//     const wordCount = content.split(/\s+/).length;
//     const minutes = Math.ceil(wordCount / wordsPerMinute);
//     return `${minutes} min read`;
//   };

//   const getExcerpt = (content: string, maxLength: number = 150) => {
//     // Remove HTML tags if any
//     const plainText = content.replace(/<[^>]*>/g, '');
//     if (plainText.length <= maxLength) return plainText;
//     return plainText.substring(0, maxLength).trim() + '...';
//   };

//   const handleClick = () => {
//     if (onClick) {
//       onClick(blog);
//     }
//   };

//   const primaryImage = blog.images && blog.images.length > 0 
//     ? blog.images[0].url 
//     : 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=500&fit=crop';

//   const primaryTag = blog.tags && blog.tags.length > 0 
//     ? blog.tags[0] 
//     : 'Travel';

//   return (
//      <>
//     <div
//       className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer"
//       onClick={handleClick}
//     >
//       {/* Image Section */}
//       <div className="relative h-56 overflow-hidden">
//         <img
//           src={primaryImage}
//           alt={blog.title}
//           className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//           onError={(e) => {
//             e.currentTarget.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=500&fit=crop';
//           }}
//         />
//         {/* Tag Badge */}
//         <div className="absolute top-4 left-4">
//           <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
//             <Tag className="w-3 h-3" />
//             {primaryTag}
//           </span>
//         </div>
//         {/* Status Badge (if draft or archived) */}
//         {blog.status !== 'published' && (
//           <div className="absolute top-4 right-4">
//             <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase">
//               {blog.status}
//             </span>
//           </div>
//         )}
//       </div>

//       {/* Content Section */}
//       <div className="p-6">
//         {/* Meta Information */}
//         <div className="flex items-center text-sm text-gray-500 mb-3 flex-wrap gap-2">
//           <div className="flex items-center">
//             <Calendar className="w-4 h-4 mr-1" />
//             <span>{formatDate(blog.createdAt)}</span>
//           </div>
//           <span>•</span>
//           <span>{getReadTime(blog.content)}</span>
//           {blog.author && (
//             <>
//               <span>•</span>
//               <div className="flex items-center">
//                 {blog.author.profileImage?.url ? (
//                   <img
//                     src={blog.author.profileImage.url}
//                     alt={blog.author.username}
//                     className="w-5 h-5 rounded-full mr-1 object-cover"
//                     onError={(e) => {
//                       e.currentTarget.style.display = 'none';
//                     }}
//                   />
//                 ) : (
//                   <User className="w-4 h-4 mr-1" />
//                 )}
//                 <span>{blog.author.username}</span>
//               </div>
//             </>
//           )}
//         </div>

//         {/* Title */}
//         <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
//           {blog.title}
//         </h3>

//         {/* Excerpt */}
//         <p className="text-gray-600 mb-4 line-clamp-3">
//           {getExcerpt(blog.content)}
//         </p>

//         {/* Tags (show up to 3) */}
//         {blog.tags && blog.tags.length > 0 && (
//           <div className="flex flex-wrap gap-2 mb-4">
//             {blog.tags.slice(0, 3).map((tag, index) => (
//               <span
//                 key={index}
//                 className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs"
//               >
//                 {tag}
//               </span>
//             ))}
//             {blog.tags.length > 3 && (
//               <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
//                 +{blog.tags.length - 3} more
//               </span>
//             )}
//           </div>
//         )}

//         {/* Read More Button */}
//         <button className="flex items-center text-orange-600 font-semibold hover:text-orange-700 transition-colors group/btn">
//           Read More
//           <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
//         </button>

//         {/* Likes Count (Optional) */}
//         {blog.likes && blog.likes.length > 0 && (
//           <div className="mt-4 pt-4 border-t border-gray-100">
//             <span className="text-sm text-gray-500">
//               {blog.likes.length} {blog.likes.length === 1 ? 'like' : 'likes'}
//             </span>
//           </div>
//         )}
//       </div>
//     </div>
//    </>
//   );
// };

// export default BlogCard;