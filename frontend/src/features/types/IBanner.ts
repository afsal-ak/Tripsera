export interface IBanner {
  _id: string;
  title: string;
  description: string;
  image: {
    url: string;
    public_id: string;
  };
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}
