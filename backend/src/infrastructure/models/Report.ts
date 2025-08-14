import { Schema, model, Document } from "mongoose";
import { IReport } from "@domain/entities/IReport";

type ReviewDocument = IReport & Document;


const ReportSchema = new Schema<ReviewDocument>(
  {
      reportedId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    reporterId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Users",
    },
    reportedType: {
      type: String,
      enum: ["blog", "review", "user"],
      required: true,
    },
  
    reason: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "resolved", "dismissed"],
      default: "pending",
    },
    adminAction: {
      type: String,
      enum: ["warn", "block", "delete", "none"],
      default: "none",
    },
  },
  {
    timestamps: true, 
  }
);

export const ReportModel = model<ReviewDocument>("Report", ReportSchema);
