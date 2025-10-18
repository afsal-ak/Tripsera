import { Schema, model, Document } from 'mongoose';
import { IReport } from '@domain/entities/IReport';
import { EnumReportStatus, EnumAdminAction, EnumReportedType } from '@constants/enum/reportEnum';

type ReportDocument = IReport & Document;

const ReportSchema = new Schema<ReportDocument>(
  {
    reportedId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    reporterId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Users',
    },
    reportedType: {
      type: String,
      enum: Object.values(EnumReportedType),
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: Object.values(EnumReportStatus),
      default: EnumReportStatus.PENDING,
    },
    adminAction: {
      type: String,
      enum: Object.values(EnumAdminAction),
      default: EnumAdminAction.NONE,
    },
  },
  {
    timestamps: true,
  }
);

export const ReportModel = model<ReportDocument>('Report', ReportSchema);
