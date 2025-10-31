import { ICustomPackage } from '@domain/entities/ICustomPackage';
import {
  CustomPkgResponseDTO,
  CustomPkgTableDTO,
  CustomPkgUserListDTO,
  CustomPackageApprovedResponseDTO
} from '../dtos/CustomPkgDTO';

export class CustomPkgMapper {
  static toResponseDTO(pkg: ICustomPackage): CustomPkgResponseDTO {
    return {
      id: pkg._id?.toString() ?? '',
      userId: pkg.userId as string,
      guestInfo: pkg.guestInfo,
      destination: pkg.destination,
      startingPoint: pkg.startingPoint,

      tripType: pkg.tripType,
      otherTripType: pkg.otherTripType,
      budget: pkg.budget,
      startDate: pkg.startDate,
      days: pkg.days,
      nights: pkg.nights,
      adults: pkg.adults,
      children: pkg.children,
      accommodation: pkg.accommodation,
      additionalDetails: pkg.additionalDetails,
      status: pkg.status,
      adminResponse: pkg.adminResponse,
      createdAt: pkg.createdAt!,
      updatedAt: pkg.updatedAt!,
    };
  }
  // Mapper for table view / list
  static toTableDTO(pkg: ICustomPackage): CustomPkgTableDTO {
    return {
      id: pkg._id?.toString() ?? '',
      userId: pkg.userId as string,
      destination: pkg.destination,
      startingPoint: pkg.startingPoint,

      tripType: pkg.tripType,
      budget: pkg.budget,
      startDate: pkg.startDate,
      days: pkg.days,
      nights: pkg.nights,
      adults: pkg.adults,
      status: pkg.status,
    };
  }
  // Table view for user (My Requests)
  static toUserListDTO(pkg: ICustomPackage): CustomPkgUserListDTO {
    return {
      id: pkg._id?.toString() ?? '',
      destination: pkg.destination,
      startingPoint: pkg.startingPoint,
      tripType: pkg.tripType,
      budget: pkg.budget,
      startDate: pkg.startDate,
      days: pkg.days,
      nights: pkg.nights,
      adults: pkg.adults,
      status: pkg.status,
      createdAt: pkg.createdAt!,
    };
  }


  static toApprovedResponseDTO(pkg: CustomPackageApprovedResponseDTO): CustomPackageApprovedResponseDTO {
    return {
      _id: pkg._id?.toString(),
      title: pkg.title,
      description: pkg.description,
      price: pkg.price,
      offer: pkg.offer
        ? {
          discountType: pkg.offer.discountType,
          discountValue: pkg.offer.discountValue,
          validUntil: pkg.offer.validUntil,
        }
        : undefined,
      isBlocked: pkg.isBlocked,
         isCustom: pkg.isCustom,
      packageType: pkg.packageType,
      createdAt: pkg.createdAt,

      userDetails: pkg.userDetails
        ? {
          _id: pkg.userDetails._id?.toString(),
          username: pkg.userDetails.username,
          email: pkg.userDetails.email,
          profileImage: pkg.userDetails?.profileImage || null,
        }
        : undefined,

      customRequest: pkg.customRequest
        ? {
          _id: pkg.customRequest._id?.toString(),
          packageName: pkg.customRequest.packageName,
          destination: pkg.customRequest.destination,
          budget: pkg.customRequest.budget,
        }
        : undefined,
    };
  }


}
