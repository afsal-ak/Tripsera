import { Request, Response, NextFunction } from 'express';
import { IBookingUseCases } from '@application/useCaseInterfaces/company/IBookingUseCases';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';
import { BookingMessages } from '@constants/messages/admin/BookingMessages';
import { getCompanyIdFromRequest } from '@shared/utils/getCompanyIdFromRequest';

export class BookingController {
  constructor(private _bookingUseCases: IBookingUseCases) { }

  getAllCompanyBookings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId= getCompanyIdFromRequest(req)
      console.log(companyId,'compnay id in bkg controller');
      
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const packageSearch = req.query.package as string;
      const status = req.query.status as string;
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;

      const { bookings, total } = await this._bookingUseCases.getAllCompanyBookings({
        companyId,
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
        message: BookingMessages.BOOKINGS_FETCHED,
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

      const booking = await this._bookingUseCases.getBookingByIdForCompany(bookingId);

      res.status(HttpStatus.OK).json({
        booking,
        message: BookingMessages.BOOKING_FETCHED,
      });
    } catch (error) {
      next(error);
    }
  };

  cancelBookingByAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bookingId = req.params.id;
      const { reason } = req.body;

      const booking = await this._bookingUseCases.cancelBookingByCompany(bookingId, reason);

      res.status(HttpStatus.OK).json({
        booking,
        message: BookingMessages.BOOKING_CANCELLED,
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

      const booking = await this._bookingUseCases.confirmBookingByCompany(bookingId, notes);

      res.status(HttpStatus.OK).json({
        booking,
        message: BookingMessages.BOOKING_CONFIRMED,
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
      res.status(HttpStatus.OK).json({
        booking: updatedBooking,
        message: BookingMessages.TRAVEL_DATE_CHANGED,
      });
    } catch (error) {
      next(error);
    }
  };
}
