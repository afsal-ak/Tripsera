export interface IUserBasic {
  _id: string;
  username: string;
  profileImage?: {
    url: string;
    public_id: string;
  } | null;
}