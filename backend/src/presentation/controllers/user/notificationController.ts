import { NextFunction, Request, Response } from 'express';
import { INotificationUseCases } from '@application/useCaseInterfaces/notification/INotificationUseCases';
import { getUserIdFromRequest } from '@shared/utils/getUserIdFromRequest';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';
import { INotificationFilter } from '@domain/entities/INotification';

export class NotificationController {
  constructor(private _notificationUseCases: INotificationUseCases) {}

  getNotifications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getUserIdFromRequest(req);

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const filters: INotificationFilter = {
        status: (req.query.status as string) || '',
      };

      const { notification, pagination } = await this._notificationUseCases.getNotifications(
        userId,
        page,
        limit,
        filters
      );

      res.status(HttpStatus.OK).json({
        data: notification,
        pagination,
        message: 'succes',
      });
    } catch (error) {
      next(error);
    }
  };

  markAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updated = await this._notificationUseCases.markAsRead(id);
      res.status(HttpStatus.OK).json({ updated, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  async deleteNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const deleted = await this._notificationUseCases.deleteNotification(id);
      res.json({ success: deleted });
    } catch (error) {
      next(error);
    }
  }
}
