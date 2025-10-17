export interface SalesReportFilterDTO {
  month?: number;
  year?: number;
  week?: number;
  page?: number;
  limit?: number;
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
  bookedAt?:Date;
  createdAt: Date;
  travelDate?: Date;
}