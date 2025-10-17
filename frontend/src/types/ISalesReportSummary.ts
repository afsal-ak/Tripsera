export interface ISalesReportSummary {
  totalBookings: number;
  totalDiscount: number;
  totalWalletUsed: number;
  totalOnlinePaid: number;
  totalRevenue: number;
}




export interface SalesReportResponseDTO {
  _id: string;
  bookingCode: string;
  username: string;
  packageTitle: string;
  packageCode:string;
  totalAmount: number;
  discount: number;
  walletAmountUsed?: number;
  amountPaid: number;
  paymentMethod: string;
  paymentStatus: string;
  bookingStatus: string;
  bookedAt:string;
  createdAt: Date;
  travelDate?: Date;
}