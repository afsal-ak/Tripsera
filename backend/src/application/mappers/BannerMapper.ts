 import { IBanner } from "@domain/entities/IBanner";
import { BannerResponseDTO } from "@application/dtos/BannerDTO";

export abstract class BannerMapper {
  static toResponseDTO(banner: IBanner): BannerResponseDTO {
    return {
      _id: banner._id?.toString() || "",
      title: banner.title,
      description: banner.description,
      image: {
        url: banner.image.url,
        public_id: banner.image.public_id,
      },
      isBlocked: !!banner.isBlocked,
    };
  }
}
