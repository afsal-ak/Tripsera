import { NotificationModel } from "@infrastructure/models/Notification";
import { INotificationRepository } from "@domain/repositories/INotificationRepository";
import { INotification } from "@domain/entities/INotification";
import { CreateNotificationDto } from "@application/dtos/NotificationDTO";
import { IFilter } from "@domain/entities/IFilter";
import { PaginationInfo } from "@application/dtos/PaginationDto";

export class NotificationRepository implements INotificationRepository {

    async create(notification: CreateNotificationDto): Promise<INotification> {
        const create = await NotificationModel.create(notification)
         // Populate userId, packageId, bookingId if they exist in schema
  const populated = await NotificationModel.findById(create._id)
    .populate("userId", "username email")        
    .populate("packageId", "title price")   
    .populate("bookingId", "title totalAmount") 
    .lean();  

  return populated as INotification;
       // return create.toObject()

    }

//     async findByUserId(
//         userId: string,
//         page: number,
//         limit: number,
//         filters?: IFilter
//     ): Promise<{ notification: INotification[], pagination: PaginationInfo }> {
//         const skip = (page - 1) * limit;
//         const query: any = {};

//         if (filters?.status == 'read') {
//             query.isRead = true
//         } else if(filters?.status=='unRead') {
//             query.isRead = false
//         }

//         const [notification, total] = await Promise.all([
//             NotificationModel.find({ userId, ...query })
//                 .skip(skip)
//                 .limit(limit)
//                 .sort({ createdAt: -1 })
//                 .lean(),
//             NotificationModel.countDocuments({ userId,...query })
//         ])

//         const pagination: PaginationInfo = {
//             totalItems: total,
//             currentPage: page,
//             pageSize: limit,
//             totalPages: Math.ceil(total / limit),
//         };

//         return { notification, pagination };
//     }

//  async findAdminNotifications(
//   page: number,
//   limit: number,
//   filters?: IFilter
// ): Promise<{ notification: INotification[]; pagination: PaginationInfo }> {
//   const skip = (page - 1) * limit;

//   const query: any = { role: "admin" }; 
//   if (filters?.status === "read") query.isRead = true;
//   if (filters?.status === "unRead") query.isRead = false;

//   const [notifications, total] = await Promise.all([
//     NotificationModel.find(query)
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
async findByUserId(
  userId: string,
  page: number,
  limit: number,
  filters?: IFilter
): Promise<{ notification: INotification[]; pagination: PaginationInfo }> {
  const skip = (page - 1) * limit;
  const query: any = { userId };

  if (filters?.status === "read") query.isRead = true;
  else if (filters?.status === "unRead") query.isRead = false;

  const [notifications, total] = await Promise.all([
    NotificationModel.find(query)
      .populate("userId", "username email")
      .populate("packageId", "title price")
      .populate("bookingId", "totalAmount status")
      // optionally populate more refs if you add them
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

  return { notification: notifications, pagination };
}

async findAdminNotifications(
  page: number,
  limit: number,
  filters?: IFilter
): Promise<{ notification: INotification[]; pagination: PaginationInfo }> {
  const skip = (page - 1) * limit;
  const query: any = { role: "admin" };

  if (filters?.status === "read") query.isRead = true;
  else if (filters?.status === "unRead") query.isRead = false;

  const [notifications, total] = await Promise.all([
    NotificationModel.find(query)
      .populate("userId", "username email")
      .populate("packageId", "title price")
      .populate("bookingId", "totalAmount status")
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

  return { notification: notifications, pagination };
}


    async delete(notificationId: string): Promise<boolean> {
        const result= await NotificationModel.findByIdAndDelete(notificationId)
        return !!result
    }

    async markAsRead(notificationId: string): Promise<INotification | null> {
        return await NotificationModel.findByIdAndUpdate(notificationId,{isRead:true},{ new: true, lean: true })
    }
      async markAllAsRead(userId: string): Promise<number> {
    const result = await NotificationModel.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );
    return result.modifiedCount; 
  }
}