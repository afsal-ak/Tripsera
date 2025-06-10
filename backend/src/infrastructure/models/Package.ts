//  import mongoose,{Schema,Document} from "mongoose";
// import { Coordinates } from "@domain/entities/IPackage";
// import { Location } from "@domain/entities/IPackage"; 
// import { IPackage } from "@domain/entities/IPackage";


// const coordinatesSchema = new Schema<Coordinates>({
//     lat: {
//         type: Number,
//         required: true
//     },
//     lng: {
//         type: Number,
//         required: true
//     }
// },
//     { _id: false }
// )

import mongoose, { Schema, Document } from "mongoose";
import { IPackage } from "@domain/entities/IPackage";
// Offer Schema (percentage or flat)
const offerSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["percentage", "flat"],
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    validUntil: {
      type: Date,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { _id: false }
);

// GeoJSON Location Schema
const locationSchema = new Schema(
  {
    name: { type: String, required: true },
    geo: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        required: true
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true
      }
    }
  },
  { _id: false }
);

// Main Package Schema
const packageSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    duration: { type: String, required: true }, 
    ///imageUrls: [{ type: String }],
    imageUrls: [
  {
    url: String,
    public_id: String
  }
],
    category: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    }
    ],
    location: {
      type: [locationSchema],
      required: true
    },
    offer: { type: offerSchema },
    isBlocked:{
        type:Boolean,
        default:false
    }
  },
  { timestamps: true }
);

// Add 2dsphere index for geo queries
packageSchema.index({ "location.geo": "2dsphere" });

// Mongoose Model
export const PackageModel = mongoose.model<IPackage & Document>(
  "Package",
  packageSchema
);
