import { IWishlistPopulated } from "@infrastructure/db/types.ts/IWishlistPopulated ";
import {
    WishlistResponseDTO,
} from "@application/dtos/WishlistDTO";

export abstract class WishlistMapper {
    static toResponseDTO(wishlist: IWishlistPopulated): WishlistResponseDTO {
        return {
            _id: wishlist._id?.toString() || "",
            userId: wishlist.userId.toString(),
            addedAt: wishlist.addedAt,
            package: {
                _id: wishlist.packageId._id,
                title: wishlist.packageId.title,
                price: wishlist.packageId.price,
                duration: wishlist.packageId.duration,
                location: wishlist.packageId.location,
                imageUrls: wishlist.packageId.imageUrls?.[0] ,
            },
        };
    }

}
