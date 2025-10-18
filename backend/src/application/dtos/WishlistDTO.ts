export interface WishlistPackageDTO {
  _id: string;
  title: string;
  price: number;
  duration: string;
  location: string;
  imageUrls: string;
}

export interface WishlistResponseDTO {
  _id: string;
  userId: string;
  package: WishlistPackageDTO;
  addedAt?: Date;
}
