import { NextFunction, Request, Response } from "express";
import { INotificationUseCases } from "@application/useCaseInterfaces/notification/INotificationUseCases";
import { CreateNotificationDto } from "@application/dtos/NotificationDTO";
import { getUserIdFromRequest } from "@shared/utils/getUserIdFromRequest";
import { HttpStatus } from "@constants/HttpStatus/HttpStatus";
export class NotificationController {
    constructor(private notificationUseCases: INotificationUseCases) { }

    getNotifications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = getUserIdFromRequest(req) // assuming auth middleware
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const result = await this.notificationUseCases.getNotifications(
                userId,
                page,
                limit,
                {}
            );

            res.status(HttpStatus.OK).json({result,message:'succes'});
        } catch (error) {
            next(error)
        }

    }

    markAsRead = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { notificationId } = req.body;
            const updated = await this.notificationUseCases.markAsRead(notificationId);
            res.json(updated);
        } catch (error) {
            next(error)
        }

    }

    async deleteNotification(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const deleted = await this.notificationUseCases.deleteNotification(id);
            res.json({ success: deleted });
        } catch (error) {
            next(error)
        }

    }
}
