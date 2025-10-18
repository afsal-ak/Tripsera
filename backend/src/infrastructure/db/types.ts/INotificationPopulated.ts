import { INotification } from '@domain/entities/INotification';

export interface INotificationPopulated
  extends Omit<INotification, 'userId' | 'packageId' | 'bookingId' | 'triggeredBy'> {
  userId?: {
    _id: string;
    username: string;
    email: string;
  };
  packageId?: {
    _id: string;
    title: string;
    price?: number;
  };
  bookingId?: {
    _id: string;
    totalAmount?: number;
    status?: string;
  };
  triggeredBy?: {
    _id: string;
    username: string;
  };
}
