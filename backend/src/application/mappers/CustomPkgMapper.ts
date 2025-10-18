import { ICustomPackage } from '@domain/entities/ICustomPackage';
import {
  CustomPkgResponseDTO,
  CustomPkgTableDTO,
  CustomPkgUserListDTO,
} from '../dtos/CustomPkgDTO';

export class CustomPkgMapper {
  static toResponseDTO(pkg: ICustomPackage): CustomPkgResponseDTO {
    return {
      id: pkg._id?.toString() ?? '',
      userId: pkg.userId as string,
      guestInfo: pkg.guestInfo,
      destination: pkg.destination,
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
}
