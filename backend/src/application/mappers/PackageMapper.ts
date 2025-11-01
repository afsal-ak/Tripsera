import { IPackage } from '@domain/entities/IPackage';
import {
  PackageResponseDTO,
  PackageTableResponseDTO,
  PackageCardDTO,
} from '@application/dtos/PackageDTO';
import { EnumOfferType, EnumPackageType } from '@constants/enum/packageEnum';

export abstract class PackageMapper {
  static toResponseDTO(pkg: IPackage): PackageResponseDTO {
    const finalPrice = PackageMapper.calculateFinalPrice(pkg);

    return {
      _id: pkg._id?.toString() || '',
      title: pkg.title,
      description: pkg.description,
      price: pkg.price,
      pricePerChild: pkg.pricePerChild!,
      finalPrice,
      durationDays: pkg.durationDays,
      durationNights: pkg.durationNights,
      ageOfAdult: pkg.ageOfAdult,
      ageOfChild: pkg.ageOfChild!,
      startDate: pkg.startDate,
      endDate: pkg.endDate,
      departureDates: pkg.departureDates || undefined,
      groupSize: pkg.groupSize,
      availableSlots: pkg.availableSlots,
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
      //isCustom:pkg?.isCustom,
      packageType: pkg.packageType || EnumPackageType.NORMAL,

      createdAt: pkg.createdAt,
      updatedAt: pkg.updatedAt,
    };
  }
  static toCardDTO(pkg: IPackage): PackageCardDTO {
    const finalPrice = this.calculateFinalPrice(pkg);
    const categoryNames = (pkg as any).categoryDetails?.map((cat: any) => cat.name) || [];

    return {
      _id: pkg._id?.toString() || '',
      title: pkg.title,
      categoryNames,
      durationDays: pkg.durationDays,
      durationNights: pkg.durationNights,
      price: pkg.price,
      finalPrice,
      imageUrl: pkg.imageUrls?.[0]?.url || null,
      //  isCustom: pkg.isCustom,
      packageType: pkg.packageType,
      availableSlots: pkg.availableSlots,
      offerName: pkg.offer?.isActive ? pkg.offer.name : undefined,
      offerType: pkg.offer?.isActive ? pkg.offer.type : undefined,
      offerValue: pkg.offer?.isActive ? pkg.offer.value : undefined,
    };
  }
  static toTableResponseDTO(pkg: IPackage): PackageTableResponseDTO {
    const finalPrice = PackageMapper.calculateFinalPrice(pkg); // fixed

    return {
      _id: pkg._id?.toString() || '',
      title: pkg.title,
      price: pkg.price,
      pricePerChild: pkg.pricePerChild!,
      finalPrice,
      ageOfAdult: pkg.ageOfAdult,
      ageOfChild: pkg.ageOfChild!,
      category: pkg.category,
      isBlocked: pkg.isBlocked,
      offerName: pkg.offer?.name,
      availableSlots: pkg.availableSlots,
      departureDates:pkg.departureDates,
      endDate: pkg.endDate,
      packageType: pkg.packageType || EnumPackageType.NORMAL,
      categoryCount: pkg.category?.length || 0,
      createdAt: pkg.createdAt,
    };
  }

  /**
   * Calculates final discounted price
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
