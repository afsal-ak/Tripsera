import { Request, Response, NextFunction } from 'express';
import { getUserIdFromRequest } from '@shared/utils/getUserIdFromRequest';
import { BookingUseCases } from '@domain/usecases/user/bookingUseCases';
import { AppError } from '@shared/utils/AppError';

export class BookingController {
  constructor(private bookingUseCases: BookingUseCases) {}

  createBookingWithOnlinePayment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = getUserIdFromRequest(req);
      const data = req.body;

      const result = await this.bookingUseCases.createBookingWithOnlinePayment(userId, data);
      res.status(201).json({
        message: 'Booking created successfully',
        booking: result.booking,
        razorpayOrder: result.razorpayOrder || null,
      });
    } catch (error) {
      next(error);
    }
  };

  verifyRazorpayPayment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      console.log(req.body, 'verify raxorpay');
      const isValid = await this.bookingUseCases.verifyRazorpaySignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );

      if (!isValid) {
        res.status(400).json({ success: false, message: 'Invalid Razorpay signature' });
        return;
      }

      await this.bookingUseCases.confirmBookingAfterPayment(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );

      res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  };

  // Cancel unpaid booking
  cancelUnpaidBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getUserIdFromRequest(req);
      const bookingId = req.params.id;

      await this.bookingUseCases.cancelUnpaidBooking(userId, bookingId);

      res.status(200).json({
        message: 'Booking cancelled successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  // Retry payment for unpaid booking
  retryBookingPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getUserIdFromRequest(req);
      const bookingId = req.params.id;
      console.log(bookingId, 'retyr payment');

      const result = await this.bookingUseCases.retryBookingPayment(userId, bookingId);

      res.status(200).json({
        message: 'New Razorpay order created',
        booking: result.booking,
        razorpayOrder: result.razorpayOrder || null,
      });
    } catch (error) {
      next(error);
    }
  };

  createBookingWithWalletPayment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = getUserIdFromRequest(req);
      const data = req.body;
      console.log(data, 'wallet payment');

      const { booking } = await this.bookingUseCases.createBookingWithWalletPayment(userId, data);

      if (!booking) {
        throw new AppError(500, 'Booking creation failed');
      }
      res.status(201).json({
        message: 'Booking created successfully using wallet',
        booking,
      });
    } catch (error) {
      next(error);
    }
  };

  //   // Get all bookings of a user with pagination
  getUserBookings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getUserIdFromRequest(req);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { bookings, total } = await this.bookingUseCases.getAllUserBooking(userId, page, limit);

      res.status(200).json({
        bookings: bookings,
        total: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        message: 'Bookings fetched successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  //   // Get single booking
  getBookingById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getUserIdFromRequest(req);
      const bookingId = req.params.id;

      const booking = await this.bookingUseCases.getBookingById(userId, bookingId);

      res.status(200).json({
        booking,
        message: 'Booking details retrieved',
      });
    } catch (error) {
      next(error);
    }
  };

  // Cancel a booking
  cancelBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getUserIdFromRequest(req);
      const bookingId = req.params.id;
      console.log(req.body, 'cancel reason');
      const { reason } = req.body;

      const booking = await this.bookingUseCases.cancelBooking(userId, bookingId, reason);

      res.status(200).json({
        booking,
        message: 'Booking cancelled successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
