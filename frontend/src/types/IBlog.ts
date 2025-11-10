// export interface IBlog {
//   _id?: string;
//   title: string;
//   slug?: string;
//   content: string;

//   images?: { url: string; public_id: string }[];
//   tags?: string[];

//   likes?: string[];
//   status: 'draft' | 'published' | 'archived';
//   author: {
//     _id: string;
//     username: string;
//     profileImage?: {
//       url: string;
//     };
//   };
//   isBlocked?: boolean;
//   createdAt?: Date;
//   updatedAt?: Date;
// }
import type { IUser } from "./IUser";
export interface IBlogSection {
  heading: string;
  content: string;
  image?: {
    url: string;
    public_id?: string;
  };
  _id:string
}

export interface IBlogComment {
  _id?:  string;
  user:  IUser;
  text: string;
  createdAt?: Date;
}

export interface IBlog {
  _id:  string;
  title: string;
  slug?: string;
  overview: string; // short intro / summary
  content: string; // can hold the main article text

  coverImage: {
    url: string;
    public_id?: string;
  };

  sections?: IBlogSection[]; // multi-section layout (heading + image + text)
  images?: { url: string; public_id?: string }[];
 author: {
    _id: string;
    username: string;
    profileImage?: {
      url: string;
    };
  };
  tags?: string[];
  //author:  IUser;

  likes?:  IUser[];
  comments?: IBlogComment[];

  status: 'draft' | 'published' | 'archived';
  isBlocked?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
