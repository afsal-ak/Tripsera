export interface IAdmin {
  _id: string;
  username?: string;
  email?: string;
  isBlocked: boolean;
  role: 'admin';
}
