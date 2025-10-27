import mongoose, { Schema, Document } from 'mongoose';
import { IPackage } from '@domain/entities/IPackage';

const offerSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['percentage', 'flat'],
      required: false,
    },
    value: {
      type: Number,
      required: false,
    },
    name: {
      type: String,
      required: false,
    },
    validUntil: {
      type: Date,
      required: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const locationSchema = new Schema(
  {
    name: { type: String, required: true }, // e.g., "Calangute Beach"
    address: { type: String }, // full address or user-friendly name
    city: { type: String }, // "Goa"
    state: { type: String }, // "Goa"
    country: { type: String, default: 'India' },

    geo: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
        required: true,
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },
    postalCode: { type: String }, // optional
    mapZoomLevel: { type: Number, default: 12 }, // optional UI helper
  },
  { _id: false }
);

const itinerarySchema = new Schema(
  {
    day: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String }, // optional but useful
    activities: [
      {
        activity: { type: String, required: true },
        startTime: { type: String, required: false },
        endTime: { type: String, required: false },
      },
    ],
  },
  { _id: false }
);

const packageSchema = new Schema(
  {
    title: { type: String, required: true },

    packageCode: {
      type: String,
      required: true,
      unique: true,
    },

    description: { type: String },
    originalPrice: { type: Number, required: false },
    finalPrice: { type: Number, required: false },
    price: { type: Number, required: true },

    // Duration
    duration: { type: String },
    durationDays: { type: Number, required: true },
    durationNights: { type: Number, required: true },

    // Images
    imageUrls: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],

    // Relations
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
      },
    ],

    location: {
      type: [locationSchema],
      required: true,
    },

    // Offer
    offer: {
      type: offerSchema,
      required: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },

    startPoint: {
      type: String,
    },
    startDate: { type: Date },
    endDate: { type: Date },

    itinerary: [itinerarySchema],

    importantDetails: { type: String },
    included: [{ type: String }],
    notIncluded: [{ type: String }],

    isCustom: {
      type: Boolean,
      default: false,
    },
    customReqId: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: 'CustomPackage',
    },
    createdFor: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: 'Users',
    }
  },
  { timestamps: true }
);

// Add 2dsphere index for geo queries
packageSchema.index({ 'location.geo': '2dsphere' });

export const PackageModel = mongoose.model<IPackage & Document>('Package', packageSchema);
