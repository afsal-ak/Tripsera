// import { NotificationModel } from "@infrastructure/models/Notification";
// import { INotificationRepository } from "@domain/repositories/INotificationRepository";
// import { INotification ,INotificationFilter} from "@domain/entities/INotification";
// import { CreateNotificationDto } from "@application/dtos/NotificationDTO";
//  import { PaginationInfo } from "@application/dtos/PaginationDto";

// export class NotificationRepository implements INotificationRepository {

//   async create(notification: CreateNotificationDto): Promise<INotification> {
//     const create = await NotificationModel.create(notification)
//     // Populate userId, packageId, bookingId if they exist in schema
//     const populated = await NotificationModel.findById(create._id)
//       .populate("userId", "username email")
//       .populate("packageId", "title price")
//       .populate("bookingId", "title totalAmount")
//       .lean();

//     return populated as INotification;

//   }

// async findByUserId(
//   userId: string,
//   page: number,
//   limit: number,
//   filters?: INotificationFilter
// ): Promise<{ notification: INotification[]; pagination: PaginationInfo }> {
//   const skip = (page - 1) * limit;
//   const query: any = { userId };

//   // --- Status filter
//   if (filters?.status === "read") query.isRead = true;
//   else if (filters?.status === "unRead") query.isRead = false;

//   // --- Type filter
//   if (filters?.type) {
//     query.type = filters.type;
//   }

//   // --- EntityType filter
//   if (filters?.entityType) {
//     query.entityType = filters.entityType;
//   }

//   // // --- Date range filter (optional, if you add from/to in DTO)
//   // if (filters?.from || filters?.to) {
//   //   query.createdAt = {};
//   //   if (filters.from) query.createdAt.$gte = new Date(filters.from);
//   //   if (filters.to) query.createdAt.$lte = new Date(filters.to);
//   // }

//   const [notifications, total] = await Promise.all([
//     NotificationModel.find(query)
//       .populate("userId", "username email")
//       .populate("packageId", "title price")
//       .populate("bookingId", "totalAmount status")
//       .populate("triggeredBy", "username")
//       .skip(skip)
//       .limit(limit)
//       .sort({ createdAt: -1 })
//       .lean(),
//     NotificationModel.countDocuments(query),
//   ]);

//   const pagination: PaginationInfo = {
//     totalItems: total,
//     currentPage: page,
//     pageSize: limit,
//     totalPages: Math.ceil(total / limit),
//   };

//   return { notification: notifications, pagination };
// }

// async findAdminNotifications(
//   page: number,
//   limit: number,
//   filters?: INotificationFilter
// ): Promise<{ notification: INotification[]; pagination: PaginationInfo }> {
//   const skip = (page - 1) * limit;
//   const query: any = { role: "admin" };

//   // --- Status filter
//   if (filters?.status === "read") query.isRead = true;
//   else if (filters?.status === "unRead") query.isRead = false;

//   // --- Type filter
//   if (filters?.type) {
//     query.type = filters.type;
//   }

//   // --- EntityType filter
//   if (filters?.entityType) {
//     query.entityType = filters.entityType;
//   }

//   // --- Date range filter
//   // if (filters?.from || filters?.to) {
//   //   query.createdAt = {};
//   //   if (filters.from) query.createdAt.$gte = new Date(filters.from);
//   //   if (filters.to) query.createdAt.$lte = new Date(filters.to);
//   // }

//   const [notifications, total] = await Promise.all([
//     NotificationModel.find(query)
//       .populate("userId", "username email")
//       .populate("packageId", "title price")
//       .populate("bookingId", "totalAmount status")
//       .skip(skip)
//       .limit(limit)
//       .sort({ createdAt: -1 })
//       .lean(),
//     NotificationModel.countDocuments(query),
//   ]);

//   const pagination: PaginationInfo = {
//     totalItems: total,
//     currentPage: page,
//     pageSize: limit,
//     totalPages: Math.ceil(total / limit),
//   };

//   return { notification: notifications, pagination };
// }

//   async delete(notificationId: string): Promise<boolean> {
//     const result = await NotificationModel.findByIdAndDelete(notificationId)
//     return !!result
//   }

//   async markAsRead(notificationId: string): Promise<INotification | null> {
//     return await NotificationModel.findByIdAndUpdate(notificationId, { isRead: true }, { new: true, lean: true })
//   }
//   async markAllAsRead(userId: string): Promise<number> {
//     const result = await NotificationModel.updateMany(
//       { userId, isRead: false },
//       { isRead: true }
//     );
//     return result.modifiedCount;
//   }
// }
import { NotificationModel } from "@infrastructure/models/Notification";
import { INotificationRepository } from "@domain/repositories/INotificationRepository";
import { INotification, INotificationFilter } from "@domain/entities/INotification";
import { INotificationPopulated } from "@infrastructure/db/types.ts/INotificationPopulated";
import { CreateNotificationDto } from "@application/dtos/NotificationDTO";
import { PaginationInfo } from "@application/dtos/PaginationDto";

export class NotificationRepository implements INotificationRepository {

  async create(notification: CreateNotificationDto): Promise<INotificationPopulated> {
    const created = await NotificationModel.create(notification);
    const populated = await NotificationModel.findById(created._id)
      .populate("userId", "username email")
      .populate("packageId", "title price")
      .populate("bookingId", "title totalAmount")
      .populate("triggeredBy", "username")
      .lean();

    return populated as INotificationPopulated;
  }

  async findByUserId(
    userId: string,
    page: number,
    limit: number,
    filters?: INotificationFilter
  ): Promise<{ notification: INotificationPopulated[]; pagination: PaginationInfo }> {
    const skip = (page - 1) * limit;
    const query: any = { userId };

    if (filters?.status === "read") query.isRead = true;
    else if (filters?.status === "unRead") query.isRead = false;

    if (filters?.type) query.type = filters.type;
    if (filters?.entityType) query.entityType = filters.entityType;

    const [notifications, total] = await Promise.all([
      NotificationModel.find(query)
        .populate("userId", "username email")
        .populate("packageId", "title price")
        .populate("bookingId", "totalAmount status")
        .populate("triggeredBy", "username")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      NotificationModel.countDocuments(query),
    ]);

    const pagination: PaginationInfo = {
      totalItems: total,
      currentPage: page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };

    return { notification: notifications as INotificationPopulated[], pagination };
  }

  async findAdminNotifications(
    page: number,
    limit: number,
    filters?: INotificationFilter
  ): Promise<{ notification: INotificationPopulated[]; pagination: PaginationInfo }> {
    const skip = (page - 1) * limit;
    const query: any = { role: "admin" };

    if (filters?.status === "read") query.isRead = true;
    else if (filters?.status === "unRead") query.isRead = false;

    if (filters?.type) query.type = filters.type;
    if (filters?.entityType) query.entityType = filters.entityType;

    const [notifications, total] = await Promise.all([
      NotificationModel.find(query)
        .populate("userId", "username email")
        .populate("packageId", "title price")
        .populate("bookingId", "totalAmount status")
        .populate("triggeredBy", "username")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      NotificationModel.countDocuments(query),
    ]);

    const pagination: PaginationInfo = {
      totalItems: total,
      currentPage: page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };

    return { notification: notifications as INotificationPopulated[], pagination };
  }

  async delete(notificationId: string): Promise<boolean> {
    const result = await NotificationModel.findByIdAndDelete(notificationId);
    return !!result;
  }

  async markAsRead(notificationId: string): Promise<INotification | null> {
    return await NotificationModel.findByIdAndUpdate(notificationId, { isRead: true }, { new: true, lean: true });
  }

  async markAllAsRead(userId: string): Promise<number> {
    const result = await NotificationModel.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );
    return result.modifiedCount;
  }
}
