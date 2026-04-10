import mongoose, { Schema, Document, Model } from "mongoose";
import { ICompany } from "@domain/entities/ICompany";

type CompanyDocument = ICompany & Document;

const CompanySchema = new Schema<CompanyDocument>(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: Number,
      required: true,
    },

    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },

    description: String,

   // website: String,

    logo: {
      url: String,
      public_id: String,
    },

    address: {
      street: String,
      city: String,
      state: String,
      country: { type: String, default: "India" },
      postalCode: String,
    },

    gstNumber: String,

    licenseNumber: String,

    documents: {
      gstCertificate: {
        url: String,
        public_id: String,
      },

      businessLicense: {
        url: String,
        public_id: String,
      },
    },

    rating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },
    isSetupComplete: {
      type: Boolean,
      default: false
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const CompanyModel: Model<CompanyDocument> =
  mongoose.model<CompanyDocument>("Company", CompanySchema);