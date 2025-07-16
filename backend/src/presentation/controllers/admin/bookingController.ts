import { Request, Response, NextFunction } from "express";
import { BookingUseCases } from "@domain/usecases/admin/bookingUseCases";

export class BookingController {
    constructor(private bookingUseCases: BookingUseCases) { }

    getAllBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const {bookings,total} = await this.bookingUseCases.getAllBookings(page, limit)
            // res.status(200).json({
            //     bookings: result.bookings,
            //     totalPages: Math.ceil(result.total / limit),
            //     message: "Bookings fetched successfully",
            // });
            res.status(200).json({
                bookings: bookings,
                total: total,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                message: "Bookings fetched successfully",
            });
        } catch (error) {
            next(error)
        }
    }

    getBookingByIdForAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const bookingId = req.params.id;

            const booking = await this.bookingUseCases.getBookingByIdForAdmin(bookingId);

            res.status(200).json({
                booking,
                message: "Booking details retrieved",
            });
        } catch (error) {
            next(error);
        }
    };

    cancelBookingByAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const bookingId = req.params.id
            const { reason } = req.body;

            const booking = await this.bookingUseCases.cancelBookingByAdmin(bookingId, reason);

            res.status(200).json({
                booking,
                message: "Booking cancelled successfully",
            });
        } catch (error) {
            next(error)
        }
    }



}

