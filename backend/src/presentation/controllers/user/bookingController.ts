import { Request, Response, NextFunction } from 'express';
import { getUserIdFromRequest } from '@shared/utils/getUserIdFromRequest';
 import { AppError } from '@shared/utils/AppError';
import { HttpStatus } from 'constants/HttpStatus/HttpStatus';
import { IBookingUseCases } from '@application/useCaseInterfaces/user/IBookingUseCases ';
export class BookingController {
  constructor(private bookingUseCases: IBookingUseCases) {}

  createBookingWithOnlinePayment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = getUserIdFromRequest(req);
      const data = req.body;

      const result = await this.bookingUseCases.createBookingWithOnlinePayment(userId, data);
      res.status(HttpStatus.CREATED).json({
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
        res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: 'Invalid Razorpay signature' });
        return;
      }

      await this.bookingUseCases.confirmBookingAfterPayment(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );

      res.status(HttpStatus.OK).json({ success: true });
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

      res.status(HttpStatus.OK).json({
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

      res.status(HttpStatus.OK).json({
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
        throw new AppError(HttpStatus.INTERNAL_SERVER_ERROR, 'Booking creation failed');
      }
      res.status(HttpStatus.CREATED).json({
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

      res.status(HttpStatus.OK).json({
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

      res.status(HttpStatus.OK).json({
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

      res.status(HttpStatus.OK).json({
        booking,
        message: 'Booking cancelled successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
