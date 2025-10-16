import { IBooking } from "@domain/entities/IBooking";
import { BookingDetailResponseDTO, BookingTableResponseDTO } from "@application/dtos/BookingDTO";
import { IBookingTable } from "@domain/entities/IBookingTable";
import { TravelerDTO } from "@application/dtos/BookingDTO";
import { BookingUserResponseDTO } from "@application/dtos/BookingDTO";
import { IBookingPopulatedForUser } from "@infrastructure/db/types.ts/IBookingPopulated";

export abstract class BookingMapper {
  
  static toAdminTableResponseDTO(booking: IBookingTable): BookingTableResponseDTO {
    return {
      _id: booking._id!.toString(),
      bookingCode: booking.bookingCode,
      userId: booking.userId as string,
      packageId: booking.packageId as string,
      packageTitle: booking.packageTitle || "",     
      packageImage:  booking?.packageImage, 
         travelers: (booking.travelers as TravelerDTO[]).map((t: TravelerDTO) => ({
        fullName: t.fullName,
        age: t.age,
        gender: t.gender,
        idType: t.idType,
        idNumber: t.idNumber,
      })),
      totalAmount: booking.totalAmount,
      discount: booking.discount || 0,
      amountPaid: booking.amountPaid,
      bookingStatus: booking.bookingStatus,
      paymentStatus: booking.paymentStatus,
      travelDate: booking.travelDate,
      createdAt: booking.createdAt,
    };
  }

   static toUserResponseDTO(booking: IBookingPopulatedForUser): BookingUserResponseDTO {
    return {
      _id: booking._id!.toString(),
      bookingCode: booking.bookingCode,
      packageId: booking.packageId._id.toString(),
      packageTitle: booking.packageId.title,
      packageImage: booking.packageId.imageUrls?.[0] || undefined,
      totalAmount: booking.totalAmount,
      amountPaid: booking.amountPaid,
      discount: booking.discount || 0,
      bookingStatus: booking.bookingStatus,
      paymentStatus: booking.paymentStatus,
      travelDate: booking.travelDate,
      createdAt: booking.createdAt,
    };
  }

  static toDetailResponseDTO(booking: IBooking): BookingDetailResponseDTO {
    return {
      _id: booking._id!.toString(),
      bookingCode: booking.bookingCode,
      userId: booking.userId as string,
      packageId: booking.packageId as string,
      travelers: booking.travelers.map(t => ({
        fullName: t.fullName,
        age: t.age,
        gender: t.gender,
        idType: t.idType,
        idNumber: t.idNumber,
      })),
      totalAmount: booking.totalAmount,
      discount: booking.discount || 0,
      couponCode: booking.couponCode,
      walletAmountUsed: booking.walletAmountUsed,
      amountPaid: booking.amountPaid,
      paymentMethod: booking.paymentMethod,
      paymentStatus: booking.paymentStatus,
      bookingStatus: booking.bookingStatus,
      contactDetails: booking.contactDetails,
      travelDate: booking.travelDate,
      rescheduleCount: booking.rescheduleCount,
      travelerHistory: booking.travelerHistory,
      previousDates: booking.previousDates,
      adjustments: booking.adjustments,
      history: booking.history,
      razorpay: booking.razorpay,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      bookedAt: booking.bookedAt,
    };
  }
}
