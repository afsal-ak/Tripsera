export interface IBlog {
  _id?: string;
  title: string;
  slug?: string;
  content: string;

  images?: { url: string; public_id: string }[];
  tags?: string[];

  likes?: string[];
  status: 'draft' | 'published' | 'archived';
  author: {
    _id: string;
    username: string;
    profileImage?: {
      url: string;
    };
  };
  isBlocked?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
