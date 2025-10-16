// import { IPackage } from '@domain/entities/IPackage';
// import { PackageResponseDTO, PackageTableResponseDTO } from '@application/dtos/PackageDTO';
// import { EnumOfferType } from '@constants/enum/packageEnum';

// export abstract class PackageMapper {
 
//   static toResponseDTO(pkg: IPackage): PackageResponseDTO {
//     const finalPrice = this.calculateFinalPrice(pkg);

//     return {
//       id: pkg._id?.toString() || '',
//       title: pkg.title,
//       description: pkg.description,
//       price: pkg.price,
//       finalPrice,
//       duration: pkg.duration,
//       durationDays: pkg.durationDays,
//       durationNights: pkg.durationNights,
//       startDate: pkg.startDate,
//       endDate: pkg.endDate,
//       category: pkg.category,
//       location: pkg.location,
//       startPoint: pkg.startPoint,
//       included: pkg.included,
//       notIncluded: pkg.notIncluded,
//       itinerary: pkg.itinerary,
//       imageUrls: pkg.imageUrls || [],
//       offer: pkg.offer
//         ? {
//             name: pkg.offer.name,
//             type:
//               pkg.offer.type === 'percentage'
//                 ? EnumOfferType.PERCENTAGE
//                 : EnumOfferType.FLAT,
//             value: pkg.offer.value,
//             validUntil: pkg.offer.validUntil,
//             isActive: pkg.offer.isActive,
//           }
//         : undefined,
//       importantDetails: pkg.importantDetails,
//       isBlocked: pkg.isBlocked,
//       createdAt: pkg.createdAt,
//       updatedAt: pkg.updatedAt,
//     };
//   }

//   /**
//    * Maps a package to a lightweight table view DTO
//    */
//   static toTableResponseDTO(pkg: IPackage): PackageTableResponseDTO {
//     const finalPrice = this.calculateFinalPrice(pkg);

//     return {
//       id: pkg._id?.toString() || '',
//       title: pkg.title,
//       price: pkg.price,
//       finalPrice,
//       duration: pkg.duration,
//       isBlocked: pkg.isBlocked,
//       offerName: pkg.offer?.name,
//       categoryCount: pkg.category?.length || 0,
//       locationCount: pkg.location?.length || 0,
//       createdAt: pkg.createdAt,
//     };
//   }

//   /**
//    * Calculates final discounted price
//    */
//   private static calculateFinalPrice(pkg: IPackage): number {
//     let finalPrice = pkg.price;
//     if (pkg.offer?.isActive && new Date(pkg.offer.validUntil) > new Date()) {
//       if (pkg.offer.type === EnumOfferType.PERCENTAGE) {
//         finalPrice = pkg.price - (pkg.price * pkg.offer.value) / 100;
//       } else if (pkg.offer.type === EnumOfferType.FLAT) {
//         finalPrice = pkg.price - pkg.offer.value;
//       }
//       finalPrice = Math.max(finalPrice, 0);
//     }
//     return finalPrice;
//   }
// }

// import { IPackage } from '@domain/entities/IPackage';
// import { PackageResponseDTO, PackageTableResponseDTO } from '@application/dtos/PackageDTO';
// import { EnumOfferType } from '@constants/enum/packageEnum';

// export abstract class PackageMapper {
  
//   /**
//    * Maps a full package entity to a detailed response DTO
//    */
//   static toResponseDTO(pkg: IPackage): PackageResponseDTO {
//     const finalPrice = this.calculateFinalPrice(pkg);

//     return {
//       id: pkg._id?.toString() || '',
//       title: pkg.title,
//       description: pkg.description,
//       price: pkg.price,
//       finalPrice,
//       duration: pkg.duration,
//       durationDays: pkg.durationDays,
//       durationNights: pkg.durationNights,
//       startDate: pkg.startDate,
//       endDate: pkg.endDate,
//       category: pkg.category,
//       location: pkg.location,
//       startPoint: pkg.startPoint,
//       included: pkg.included,
//       notIncluded: pkg.notIncluded,
//       itinerary: pkg.itinerary,
//       imageUrls: pkg.imageUrls || [],
//       offer: pkg.offer
//         ? {
//             name: pkg.offer.name,
//             type:
//               pkg.offer.type === EnumOfferType.PERCENTAGE
//                 ? EnumOfferType.PERCENTAGE
//                 : EnumOfferType.FLAT,
//             value: pkg.offer.value,
//             validUntil: pkg.offer.validUntil,
//             isActive: pkg.offer.isActive,
//           }
//         : undefined,
//       importantDetails: pkg.importantDetails,
//       isBlocked: pkg.isBlocked,
//       createdAt: pkg.createdAt,
//       updatedAt: pkg.updatedAt,
//     };
//   }

//   /**
//    * Maps a package to a lightweight table view DTO
//    */
//   static toTableResponseDTO(pkg: IPackage): PackageTableResponseDTO {
//     const finalPrice = this.calculateFinalPrice(pkg);

//     return {
//       id: pkg._id?.toString() || '',
//       title: pkg.title,
//       price: pkg.price,
//       finalPrice,
//       duration: pkg.duration,
//       isBlocked: pkg.isBlocked,
//       offerName: pkg.offer?.name,
//       categoryCount: pkg.category?.length || 0,
//       locationCount: pkg.location?.length || 0,
//       createdAt: pkg.createdAt,
//     };
//   }

//   /**
//    * Calculates final discounted price
//    */
//   private static calculateFinalPrice(pkg: IPackage): number {
//     let finalPrice = pkg.price;

//     if (pkg.offer?.isActive && new Date(pkg.offer.validUntil) > new Date()) {
//       if (pkg.offer.type === EnumOfferType.PERCENTAGE) {
//         finalPrice = pkg.price - (pkg.price * pkg.offer.value) / 100;
//       } else if (pkg.offer.type === EnumOfferType.FLAT) {
//         finalPrice = pkg.price - pkg.offer.value;
//       }
//       finalPrice = Math.max(finalPrice, 0);
//     }

//     return finalPrice;
//   }
// }
import { IPackage } from '@domain/entities/IPackage';
import { PackageResponseDTO, PackageTableResponseDTO } from '@application/dtos/PackageDTO';
import { EnumOfferType } from '@constants/enum/packageEnum';

export abstract class PackageMapper {
  /**
   * Maps a full package entity to a detailed response DTO
   */
  static toResponseDTO(pkg: IPackage): PackageResponseDTO {
    const finalPrice = PackageMapper.calculateFinalPrice(pkg); // ✅ fixed

    return {
      _id: pkg._id?.toString() || '',
      title: pkg.title,
      description: pkg.description,
      price: pkg.price,
      finalPrice,
      duration: pkg.duration,
      durationDays: pkg.durationDays,
      durationNights: pkg.durationNights,
      startDate: pkg.startDate,
      endDate: pkg.endDate,
      category: pkg.category,
      location: pkg.location,
      startPoint: pkg.startPoint,
      included: pkg.included,
      notIncluded: pkg.notIncluded,
      itinerary: pkg.itinerary,
      imageUrls: pkg.imageUrls || [],
      offer: pkg.offer
        ? {
            name: pkg.offer.name,
            type:
              pkg.offer.type === EnumOfferType.PERCENTAGE
                ? EnumOfferType.PERCENTAGE
                : EnumOfferType.FLAT,
            value: pkg.offer.value,
            validUntil: pkg.offer.validUntil,
            isActive: pkg.offer.isActive,
          }
        : undefined,
      importantDetails: pkg.importantDetails,
      isBlocked: pkg.isBlocked,
      createdAt: pkg.createdAt,
      updatedAt: pkg.updatedAt,
    };
  }

  /**
   * Maps a package to a lightweight table view DTO
   */
  static toTableResponseDTO(pkg: IPackage): PackageTableResponseDTO {
    const finalPrice = PackageMapper.calculateFinalPrice(pkg); // ✅ fixed

    return {
      _id: pkg._id?.toString() || '',
      title: pkg.title,
      price: pkg.price,
      finalPrice,
      duration: pkg.duration,
            category: pkg.category,

      isBlocked: pkg.isBlocked,
      offerName: pkg.offer?.name,
      categoryCount: pkg.category?.length || 0,
      locationCount: pkg.location?.length || 0,
      createdAt: pkg.createdAt,
    };
  }

  /**
   * Calculates final discounted price (embedded safely)
   */
  private static calculateFinalPrice(pkg: IPackage): number {
    let finalPrice = pkg.price;

    if (pkg.offer?.isActive && new Date(pkg.offer.validUntil) > new Date()) {
      if (pkg.offer.type === EnumOfferType.PERCENTAGE) {
        finalPrice = pkg.price - (pkg.price * pkg.offer.value) / 100;
      } else if (pkg.offer.type === EnumOfferType.FLAT) {
        finalPrice = pkg.price - pkg.offer.value;
      }
      finalPrice = Math.max(finalPrice, 0);
    }

    return finalPrice;
  }
}
