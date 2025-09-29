export type ChatRoomFilter = "all" | "read" | "unread";

export interface IChatRoomFilter {
  filter?: ChatRoomFilter;          
  sort?: "asc" | "desc";           
  sortBy?: "createdAt" | "updatedAt";  
}

