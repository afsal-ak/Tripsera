// export interface INotification {
//     //   _id: string;
//     //   userId: string;          
//     //   title: string;           
//     //   message: string;       
//     //   type: "info" | "warning" | "success" | "error"; 
//     //   isRead: boolean;       
//     //   createdAt: Date;
//     //   updatedAt?: Date;
//     _id: string;
//     recipientId: string;
//     recipientType: "user" | "admin";
//     title: string;
//     message: string;
//     type: "info" | "warning" | "success" | "error";
//     isRead: boolean;
//     createdAt: Date;
//     updatedAt: Date;
// }

 
 export interface INotification {
    _id:string;
userId: string; // userId or adminId
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  isRead: boolean;

    metadata?: Record<string, any>; 

  // Extra metadata (optional, varies by notification type)
  // bookingId?: Types.ObjectId;
  // packageId?: Types.ObjectId;
   triggeredBy?:string; // who caused it (e.g., a user booking)

  createdAt: Date;
  updatedAt: Date;

 }