// export interface IUser{
//     _id:string;
//     username?:string;
//     email?:string;
//     isBlocked:boolean;
//       profileImage: {
//     url: string;
//     public_id: string;
//   };
//     role:"user"|"admin"
// }

export interface IUser {
  _id?: string;
  username?: string;
  email: string;
  phone?: number;
  password?: string;
  role?: 'user' | 'admin';
  isBlocked?: boolean;
  isPrivate?: boolean;
  fullName?: string;
  dob?: Date;
  gender?: 'male' | 'female';
  profileImage?: {
    url: string;
    public_id: string;
  };
  coverImage?: {
    url: string;
    public_id: string;
  };
  bio?: string;
  links?: {
    platform: string;
    url: string;
  }[];
  followers?: string[];
  following?: string[];
  referralCode?: string;
  interests?: string[];
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  followersCount:number,
  followingCount:number,
  googleId?: string;
  isGoogleUser?: boolean;
  createdAt?: Date;
}
