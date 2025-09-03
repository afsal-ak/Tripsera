// import { Link } from "react-router-dom";

// interface ChatItemProps {
//   chat: any;
// }

// const ChatItem: React.FC<ChatItemProps> = ({ chat }) => {
//   return (
//     <Link
//       to={`/messages/${chat._id}`}
//       className="flex items-center px-4 py-3 hover:bg-light cursor-pointer transition"
//     >
//       <img
//         src={chat.profileImage}
//         alt={chat.name}
//         className="w-12 h-12 rounded-full mr-4"
//       />
//       <div className="flex-1 min-w-0">
//         <div className="flex justify-between items-center">
//           <h2 className="text-darkText font-semibold truncate">{chat.name}</h2>
//           <span className="text-xs text-muted-foreground">
//             {new Date(chat.updatedAt).toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit",
//             })}
//           </span>
//         </div>
//         <div className="flex justify-between items-center">
//           <p className="text-sm text-muted-foreground truncate">
//             {chat.lastMessageContent}
//           </p>
//           {chat.unread > 0 && (
//             <span className="ml-2 bg-orange text-white text-xs rounded-full px-2 py-0.5">
//               {chat.unread}
//             </span>
//           )}
//         </div>
//       </div>
//     </Link>
//   );
// };

// export default ChatItem;
