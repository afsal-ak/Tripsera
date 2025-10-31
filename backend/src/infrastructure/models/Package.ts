// import mongoose, { Schema, Document,model } from 'mongoose';
// import { IPackage } from '@domain/entities/IPackage';
// import { EnumOfferType, EnumPackageType } from '@constants/enum/packageEnum';

// const offerSchema = new Schema(
//   {
//     type: {
//       type: String,
//       enum: Object.values(EnumOfferType),
//       required: false,
//     },
//     value: {
//       type: Number,
//       required: false,
//     },
//     name: {
//       type: String,
//       required: false,
//     },
//     validUntil: {
//       type: Date,
//       required: false,
//     },
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   { _id: false }
// );

// const locationSchema = new Schema(
//   {
//     name: { type: String, required: true }, // e.g., "Calangute Beach"
//     address: { type: String }, // full address or user-friendly name
//     city: { type: String }, // "Goa"
//     state: { type: String }, // "Goa"
//     country: { type: String, default: 'India' },

//     geo: {
//       type: {
//         type: String,
//         enum: ['Point'],
//         default: 'Point',
//         required: true,
//       },
//       coordinates: {
//         type: [Number], // [lng, lat]
//         required: true,
//       },
//     },
//     postalCode: { type: String }, // optional
//     mapZoomLevel: { type: Number, default: 12 }, // optional UI helper
//   },
//   { _id: false }
// );

// const itinerarySchema = new Schema(
//   {
//     day: { type: Number, required: true },
//     title: { type: String, required: true },
//     description: { type: String }, // optional but useful
//     activities: [
//       {
//         activity: { type: String, required: true },
//         startTime: { type: String, required: false },
//         endTime: { type: String, required: false },
//       },
//     ],
//   },
//   { _id: false }
// );
//   type PackageDocument=IPackage& Document 
 
// const packageSchema = new Schema<PackageDocument>(
//   {
//     title: { type: String, required: true },

//     packageCode: {
//       type: String,
//       required: true,
//       unique: true,
//     },

//     description: { type: String },
//     originalPrice: { type: Number, required: false },
//     finalPrice: { type: Number, required: false },
//     price: { type: Number, required: true },

//     // Duration
//     duration: { type: String },
//     durationDays: { type: Number, required: true },
//     durationNights: { type: Number, required: true },

//     // Images
//     imageUrls: [
//       {
//         url: { type: String, required: true },
//         public_id: { type: String, required: true },
//       },
//     ],

//     // Relations
//     category: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Category',
//         required: true,
//       },
//     ],

//     location: {
//       type: [locationSchema],
//       required: true,
//     },

//     // Offer
//     offer: {
//       type: offerSchema,
//       required: false,
//     },
//     isBlocked: {
//       type: Boolean,
//       default: false,
//     },

//     startPoint: {
//       type: String,
//     },
//     startDate: { type: Date },
//     endDate: { type: Date },

//     itinerary: [itinerarySchema],

//     importantDetails: { type: String },
//     included: [{ type: String }],
//     notIncluded: [{ type: String }],

//     packageType: {
//       enum: Object.values(EnumPackageType),
//       default: EnumPackageType.NORMAL
//     },
//     customReqId: {
//       type: Schema.Types.ObjectId,
//       required: false,
//       ref: 'CustomPackage',
//     },
//     createdFor: {
//       type: Schema.Types.ObjectId,
//       required: false,
//       ref: 'Users',
//     }
//   },
//   { timestamps: true }
// );

// // Add 2dsphere index for geo queries
// packageSchema.index({ 'location.geo': '2dsphere' });

// export const PackageModel = model<PackageDocument>('Package', packageSchema);
//  import mongoose, { Schema, Document, model } from 'mongoose';
// import { IPackage } from '@domain/entities/IPackage';
// import { EnumOfferType, EnumPackageType } from '@constants/enum/packageEnum';

// const offerSchema = new Schema(
//   {
//     name: { type: String },
//     type: { type: String, enum: Object.values(EnumOfferType) },
//     value: { type: Number },
//     validUntil: { type: Date },
//     isActive: { type: Boolean, default: true },
//   },
//   { _id: false }
// );

// const locationSchema = new Schema(
//   {
//     name: { type: String, required: true },
//     address: { type: String },
//     city: { type: String },
//     state: { type: String },
//     country: { type: String, default: 'India' },
//     postalCode: { type: String },
//     mapZoomLevel: { type: Number, default: 12 },
//     geo: {
//       type: {
//         type: String,
//         enum: ['Point'],
//         default: 'Point',
//         required: true,
//       },
//       coordinates: {
//         type: [Number], // [lng, lat]
//         required: true,
//       },
//     },
//   },
//   { _id: false }
// );

// const itinerarySchema = new Schema(
//   {
//     day: { type: Number, required: true },
//     title: { type: String, required: true },
//     description: { type: String },
//     activities: [
//       {
//         activity: { type: String, required: true },
//         startTime: { type: String },
//         endTime: { type: String },
//       },
//     ],
//   },
//   { _id: false }
// );

// type PackageDocument = IPackage & Document;

// const packageSchema = new Schema<PackageDocument>(
//   {
//     packageCode: { type: String, required: true, unique: true },
//     title: { type: String, required: true },
//     description: { type: String, required: true },
//     price: { type: Number, required: true },
//     originalPrice: { type: Number },
//     finalPrice: { type: Number },
//     duration: { type: String, required: false },
//     durationDays: { type: Number, required: true },
//     durationNights: { type: Number, required: true },

//     imageUrls: [
//       {
//         url: { type: String, required: true },
//         public_id: { type: String, required: true },
//       },
//     ],

//     category: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Category',
//         required: true,
//       },
//     ],

//     location: { type: [locationSchema], required: true },
//     itinerary: [itinerarySchema],

//     included: [{ type: String }],
//     notIncluded: [{ type: String }],
//     importantDetails: { type: String },

//     offer: offerSchema,

//     // Dates
//     startDate: { type: Date },
//     endDate: { type: Date },
//     departureDates: [{ type: Date }],

//     // Group info
//     groupSize: { type: Number },
//     availableSlots: { type: Number },

//     startPoint: { type: String },
//     isBlocked: { type: Boolean, default: false },

//     // Type discriminator
//     packageType: {
//       type: String,
//       enum: Object.values(EnumPackageType),
//       default: EnumPackageType.NORMAL,
//     },

//     // Relations
//     customReqId: { type: Schema.Types.ObjectId, ref: 'CustomPackage' },
//     createdFor: { type: Schema.Types.ObjectId, ref: 'Users' },
//   },
//   { timestamps: true }
// );

// packageSchema.index({ 'location.geo': '2dsphere' });

// export const PackageModel = model<PackageDocument>('Package', packageSchema);
import mongoose, { Schema, Document, model } from 'mongoose';
import { IPackage } from '@domain/entities/IPackage';
import { EnumOfferType, EnumPackageType } from '@constants/enum/packageEnum';

const offerSchema = new Schema(
  {
    name: { type: String },
    type: { type: String, enum: Object.values(EnumOfferType) },
    value: { type: Number },
    validUntil: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { _id: false }
);

const locationSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String, default: 'India' },
    postalCode: { type: String },
    mapZoomLevel: { type: Number, default: 12 },
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

const itinerarySchema = new Schema(
  {
    day: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String },
    activities: [
      {
        activity: { type: String, required: true },
        startTime: { type: String },
        endTime: { type: String },
      },
    ],
  },
  { _id: false }
);

const addonSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
  },
  { _id: false }
);

const departureVariantSchema = new Schema(
  {
    startPoint: { type: String, required: true },
    priceAdult: { type: Number, required: true },
    priceChild: { type: Number },
    availableSlots: { type: Number },
    groupSize: { type: Number },
    departureDates: [{ type: Date }],
  },
  { _id: false }
);

const accommodationSchema = new Schema(
  {
    hotelName: { type: String, required: true },
    location: { type: String },
    roomType: { type: String },
    rating: { type: Number },
    amenities: [{ type: String }],
    description: { type: String },
    images: [
      {
        url: { type: String },
        public_id: { type: String },
      },
    ],
  },
  { _id: false }
);

const policySchema = new Schema(
  {
    cancellationPolicy: { type: String },
    refundPolicy: { type: String },
    termsAndConditions: { type: String },
    importantNotes: { type: String },
  },
  { _id: false }
);

const ageGroupSchema = new Schema(
  {
    adultMinAge: { type: Number, default: 12 },
    childMaxAge: { type: Number, default: 11 },
  },
  { _id: false }
);

type PackageDocument = IPackage & Document;

const packageSchema = new Schema<PackageDocument>(
  {
    packageCode: { type: String, required: true, unique: true },
    slug: { type: String, unique: true, sparse: true }, 
    title: { type: String, required: true },
    description: { type: String, required: true },

    price: { type: Number, required: true },
    childPrice: { type: Number },
    originalPrice: { type: Number },
    finalPrice: { type: Number },

    duration: { type: String },
    durationDays: { type: Number, required: true },
    durationNights: { type: Number, required: true },

    imageUrls: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],

    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
      },
    ],

    location: { type: [locationSchema], required: true },
    itinerary: [itinerarySchema],

    included: [{ type: String }],
    notIncluded: [{ type: String }],

    importantDetails: { type: String },

    offer: offerSchema,

    // Add-ons
    addons: [addonSchema],

    // Multiple starting points / variants
    departureVariants: [departureVariantSchema],

    // Age group
    ageGroup: ageGroupSchema,

    // Accommodation
    accommodationDetails: [accommodationSchema],

    // Policies
    policies: policySchema,

    // Dates
    startDate: { type: Date },
    endDate: { type: Date },
    departureDates: [{ type: Date }],

    // Group info
    groupSize: { type: Number },
    availableSlots: { type: Number },

    startPoint: { type: String },
    isBlocked: { type: Boolean, default: false },

    // Package type
    packageType: {
      type: String,
      enum: Object.values(EnumPackageType),
      default: EnumPackageType.NORMAL,
    },

    // Relations
    customReqId: { type: Schema.Types.ObjectId, ref: 'CustomPackage' },
    createdFor: { type: Schema.Types.ObjectId, ref: 'Users' },
  },
  { timestamps: true }
);

packageSchema.index({ 'location.geo': '2dsphere' });
packageSchema.index({ slug: 1 });

export const PackageModel = model<PackageDocument>('Package', packageSchema);
