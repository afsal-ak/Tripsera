interface PackageLocation {
  name: string;
  geo: {
    type: string;
    coordinates: number[];
  };
}

export interface WishlistItem {
  _id: string;
  packageId: {
    _id: string;
    title: string;
    price: string;
    imageUrls: { url: string }[];
    location: PackageLocation[];
  };
}
