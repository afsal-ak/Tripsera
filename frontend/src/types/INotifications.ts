export type IType = 'info' | 'warning' | 'success' | 'error' | 'warning';
export type IEntityType =
  | 'booking'
  | 'package'
  | 'customPackage'
  | 'review'
  | 'wallet'
  | 'report'
  | 'follow';

export interface INotification {
  _id: string;
  userId?: string;
  //role: IRole,
  title: string;
  message: string;
  entityType: IEntityType;
  type: IType;
  isRead: boolean;
  packageId?: string;
  bookingId?: { _id: string };
  reportedId?: string;
  metadata?: Record<string, any>;
  triggeredBy?: {
    _id: string;
    username: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface INotificationFilter {
  page?: number;
  limit?: number;
  type?: string;
  entityType?: string;
  status?: 'all' | 'read' | 'unRead';
}
