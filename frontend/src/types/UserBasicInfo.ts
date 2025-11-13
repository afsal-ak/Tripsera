export interface UserBasicInfo {
  _id: string;
  username?: string;
  email?: string;
  profileImage?: string;
  isNewsletterSubscribed?: boolean;
}


export interface IUserReduxBasicInfo {
  _id: string;
  username?: string;
  email?: string;
 profileImage?: {
    url: string;
    public_id: string;
  };
  isNewsletterSubscribed?: boolean;
}
