export interface SafeUser {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
}
