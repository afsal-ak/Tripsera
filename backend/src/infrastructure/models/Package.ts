import mongoose, { Schema, Document } from 'mongoose';
import { IPackage } from '@domain/entities/IPackage';

// Offer Schema
const offerSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['percentage', 'flat'],
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    validUntil: {
      type: Date,
      required: true,
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
    name: { type: String, required: true },
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
  },
  { _id: false }
);

// Itinerary Day Schema
const itinerarySchema = new Schema(
  {
    day: { type: Number, required: true },
    title: { type: String, required: true },
    activities: [{ type: String, required: true }],
  },
  { _id: false }
);

// Main Package Schema
const packageSchema = new Schema(
  {
    title: { type: String, required: true },
     packageCode: {
      type: String,
      required: true,
      unique: true,
    },
    description: { type: String },
    price: { type: Number, required: true },
    duration: { type: String, required: true },

    imageUrls: [
      {
        url: { type: String },
        public_id: { type: String },
      },
    ],

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

    offer: { type: offerSchema },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    startDate: { type: Date },
    endDate: { type: Date },

    itinerary: [itinerarySchema],
    importantDetails: { type: String },

    included: [{ type: String }],
    notIncluded: [{ type: String }],
  },
  { timestamps: true }
);

// Add 2dsphere index for geo queries
packageSchema.index({ 'location.geo': '2dsphere' });

export const PackageModel = mongoose.model<IPackage & Document>('Package', packageSchema);
