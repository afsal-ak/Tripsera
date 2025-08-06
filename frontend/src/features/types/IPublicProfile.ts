
export interface IPublicProfile {
  _id: string;
  username: string;
  fullName?: string;
  bio?: string;
  profileImage?: {
    url: string;
    public_id: string;
  };
  coverImage?: {
    url: string;
    public_id: string;
  };
  followersCount: number;
  followingCount: number;
}



