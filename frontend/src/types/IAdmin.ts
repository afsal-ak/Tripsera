export interface IAdmin {
  _id: string;
  username?: string;
  email: string;
  isBlocked: boolean;
  role: 'admin';
  profileImage?: {
    url: string;
    public_id: string;
  };
}
