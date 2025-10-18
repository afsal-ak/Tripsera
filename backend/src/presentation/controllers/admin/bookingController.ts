import { Request, Response, NextFunction } from 'express';
import { IBookingUseCases } from '@application/useCaseInterfaces/admin/IBookingUseCases';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';

export class BookingController {
  constructor(private _bookingUseCases: IBookingUseCases) {}

  getAllBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const packageSearch = req.query.package as string;
      const status = req.query.status as string;
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;

      const { bookings, total } = await this._bookingUseCases.getAllBookings({
        page,
        limit,
        packageSearch,
        status,
        startDate,
        endDate,
      });

      res.status(HttpStatus.OK).json({
        bookings,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        message: 'Bookings fetched successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  getBookingByIdForAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const bookingId = req.params.id;

      const booking = await this._bookingUseCases.getBookingByIdForAdmin(bookingId);

      res.status(HttpStatus.OK).json({
        booking,
        message: 'Booking details retrieved',
      });
    } catch (error) {
      next(error);
    }
  };

  cancelBookingByAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bookingId = req.params.id;
      const { reason } = req.body;

      const booking = await this._bookingUseCases.cancelBookingByAdmin(bookingId, reason);

      res.status(HttpStatus.OK).json({
        booking,
        message: 'Booking cancelled successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  confirmBookingByAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const bookingId = req.params.id;
      const { notes } = req.body;

      const booking = await this._bookingUseCases.confirmBookingByAdmin(bookingId, notes);

      res.status(HttpStatus.OK).json({
        booking,
        message: 'Booking Confirmed successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  changeTravelDate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bookingId = req.params.id;

      const { newDate, note } = req.body;

      const updatedBooking = await this._bookingUseCases.changeTravelDate(
        bookingId,
        new Date(newDate),
        note
      );
      res.status(HttpStatus.OK).json(updatedBooking);
    } catch (error) {
      next(error);
    }
  };
}
