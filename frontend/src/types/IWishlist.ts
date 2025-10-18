interface PackageLocation {
  name: string;
  contry: string;
  geo: {
    type: string;
    coordinates: number[];
  };
}

export interface WishlistPackageDTO {
  _id: string;
  title: string;
  price: number;
  duration: string;
  location: PackageLocation[];
  imageUrls: { url: string };
}

export interface IWishlist {
  _id: string;
  userId: string;
  package: WishlistPackageDTO;
  addedAt?: Date;
}
