import { IBooking } from '@domain/entities/IBooking';

export interface IBookingPopulatedForUser extends Omit<IBooking, 'packageId'> {
  packageId: {
    _id: string;
    title: string;
    imageUrls: string[];
  };
}
