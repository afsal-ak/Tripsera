import { Types } from 'mongoose';
import { EnumAdminAction, EnumReportStatus, EnumReportedType } from '@constants/enum/reportEnum';

export interface IReport {
  _id?: string;
  reportedId: Types.ObjectId | string;
  reporterId: Types.ObjectId | string;
  reportedType: EnumReportedType;
  reason: string;
  description?: string;
  status: EnumReportStatus;
  adminAction: EnumAdminAction;
  createdAt?: Date;
  updatedAt?: Date;
}
