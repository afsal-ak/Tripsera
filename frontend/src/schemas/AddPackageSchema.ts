// import { z } from 'zod';

// // Regex helpers
// const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
// const latRegex = /^-?([0-8]?\d(\.\d+)?|90(\.0+)?)$/; // -90 to 90
// const lngRegex = /^-?(180(\.0+)?|((1[0-7]\d)|([0-9]?\d))(\.\d+)?)$/; // -180 to 180

// export const offerSchema = z
//   .object({
//     name: z.string().trim().optional(),
//     type: z.enum(['percentage', 'flat']).optional(),
//     value: z.preprocess((val) => Number(val), z.number().optional()),
//     validUntil: z.string().optional(),
//     isActive: z.boolean().default(false).optional(),
//   })
//   .superRefine((data, ctx) => {
//     if (!data.isActive) return; // skip if not active

//     // Name required
//     if (!data.name?.trim()) {
//       ctx.addIssue({
//         code: 'custom',
//         message: 'Offer name is required when active',
//         path: ['name'],
//       });
//     }

//     // Type required
//     if (!data.type) {
//       ctx.addIssue({
//         code: 'custom',
//         message: 'Offer type is required when active',
//         path: ['type'],
//       });
//     }

//     //  Value required
//     if (data.value === undefined || data.value <= 0) {
//       ctx.addIssue({
//         code: 'custom',
//         message: 'Offer value must be greater than 0 when active',
//         path: ['value'],
//       });
//     }

//     // Percentage max 100
//     if (data.type === 'percentage' && data.value && data.value > 100) {
//       ctx.addIssue({
//         code: 'custom',
//         message: 'Percentage offer value cannot exceed 100',
//         path: ['value'],
//       });
//     }

//     //  Valid Until required and future date
//     if (!data.validUntil) {
//       ctx.addIssue({
//         code: 'custom',
//         message: 'Offer valid until date is required',
//         path: ['validUntil'],
//       });
//     } else {
//       const validDate = new Date(data.validUntil);
//       if (validDate <= new Date()) {
//         ctx.addIssue({
//           code: 'custom',
//           message: 'Offer expiry date must be a future date',
//           path: ['validUntil'],
//         });
//       }
//     }
//   });


// // Activity schema
// export const activitySchema = z
//   .object({
//     startTime: z
//       .string()
//       .trim()
//       .min(1, 'Start time is required')
//       .regex(timeRegex, 'Start time must be in HH:mm format'),
//     endTime: z
//       .string()
//       .trim()
//       .min(1, 'End time is required')
//       .regex(timeRegex, 'End time must be in HH:mm format'),
//     activity: z.string().trim().min(3, 'Activity must be at least 3 characters'),
//   })
//   .refine((data) => data.endTime > data.startTime, {
//     message: 'End time must be after start time',
//     path: ['endTime'],
//   });

// // Itinerary day schema
// export const itineraryDaySchema = z.object({
//   day: z
//     .number({
//       required_error: 'Day number is required',
//       invalid_type_error: 'Day must be a number',
//     })
//     .min(1, 'Day number must be at least 1'),
//   title: z.string().trim().min(1, 'Day title is required'),
//   description: z.string().trim().min(3, 'Description must be at least 3 characters').optional(),
//   activities: z.array(activitySchema).min(1, 'At least one activity is required'),
// });

// //  Base package schema
// const packageBaseSchema = z.object({
//   title: z.string().trim().min(3, { message: 'Title must be at least 3 characters' }),
//   description: z.string().trim().min(10, { message: 'Description must be at least 10 characters' }),
//   price: z.coerce
//     .number({
//       required_error: 'Price is required',
//       invalid_type_error: 'Price must be a number',
//     })
//     .positive({ message: 'Price must be greater than 0' }),
//   // pricePerChild: z.coerce
//   //   .number({
//   //     required_error: 'Price is required',
//   //     invalid_type_error: 'Price must be a number',
//   //   })
//   //   .positive({ message: 'Price must be greater than 0' }),
//     pricePerChild: z.coerce.number().positive('Child price must be greater than 0').optional(),

//   durationDays: z.coerce
//     .number({
//       required_error: 'Duration (days) is required',
//       invalid_type_error: 'Please enter a valid number of days',
//     })
//     .min(1, { message: 'Days must be at least 1' }),
//   durationNights: z.coerce
//     .number({
//       required_error: 'Duration (nights) is required',
//       invalid_type_error: 'Please enter a valid number of nights',
//     })
//     .min(0, { message: 'Nights must be at least 0' }),
//   startDate: z.string().nonempty({ message: 'Start date is required' }),
//   endDate: z.string().nonempty({ message: 'End date is required' }),
//   category: z.array(z.string().trim().min(1, 'Category cannot be empty')).min(1, 'At least one category is required'),
//   startPoint: z.string().trim().min(3, { message: 'Starting point must be at least 3 characters' }),
//   location: z
//     .array(
//       z.object({
//         name: z.string().trim().min(2, { message: 'Location name must be at least 2 characters' }),
//         lat: z.string().regex(latRegex, 'Latitude must be between -90 and 90'),
//         lng: z.string().regex(lngRegex, 'Longitude must be between -180 and 180'),
//       })
//     )
//     .min(1, { message: 'At least 1 location is required' }),
//   included: z.array(z.string().trim().min(1, { message: 'Included item cannot be empty' })),
//   notIncluded: z.array(z.string().trim().min(1, { message: 'Not Included item cannot be empty' })),
//   itinerary: z.array(itineraryDaySchema),
//   images: z.array(z.instanceof(File)).min(1, { message: 'At least 1 image is required' }),
//   offer: offerSchema.optional(),
// });

// //  Add Package Schema
// export const addPackageSchema = packageBaseSchema.superRefine((data, ctx) => {
//   if (data.itinerary.length !== data.durationDays) {
//     ctx.addIssue({ code: 'custom', message: `Itinerary must have exactly ${data.durationDays} day(s)`, path: ['itinerary'] });
//   }
//   if (data.durationNights > data.durationDays) {
//     ctx.addIssue({ code: 'custom', message: 'Nights cannot be more than days', path: ['durationNights'] });
//   }
//   if (data.durationDays - data.durationNights > 1) {
//     ctx.addIssue({ code: 'custom', message: 'Nights should be equal to or one less than days', path: ['durationNights'] });
//   }
//   if (new Date(data.endDate) < new Date(data.startDate)) {
//     ctx.addIssue({ code: 'custom', message: 'End date must be after start date', path: ['endDate'] });
//   }
// });

// export type AddPackageFormSchema = z.infer<typeof addPackageSchema>;

// //  Edit Package Schema
// export const editPackageSchema = packageBaseSchema
//   .extend({
//     images: z.array(z.instanceof(File)).optional(),
//   })
//   .superRefine((data, ctx) => {
//     if (data.itinerary.length !== data.durationDays) {
//       ctx.addIssue({ code: 'custom', message: `Itinerary must have exactly ${data.durationDays} day(s)`, path: ['itinerary'] });
//     }
//     if (data.durationNights > data.durationDays) {
//       ctx.addIssue({ code: 'custom', message: 'Nights cannot be more than days', path: ['durationNights'] });
//     }
//     if (data.durationDays - data.durationNights > 1) {
//       ctx.addIssue({ code: 'custom', message: 'Nights should be equal to or one less than days', path: ['durationNights'] });
//     }
//     if (new Date(data.endDate) < new Date(data.startDate)) {
//       ctx.addIssue({ code: 'custom', message: 'End date must be after start date', path: ['endDate'] });
//     }
//   });

// export type EditPackageFormSchema = z.infer<typeof editPackageSchema>;
import { z } from 'zod';

// Regex helpers
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
const latRegex = /^-?([0-8]?\d(\.\d+)?|90(\.0+)?)$/;
const lngRegex = /^-?(180(\.0+)?|((1[0-7]\d)|([0-9]?\d))(\.\d+)?)$/;

// ---------------- OFFER ----------------
export const offerSchema = z
  .object({
    name: z.string().trim().optional(),
    type: z.enum(['percentage', 'flat']).optional(),
    value: z.preprocess((val) => Number(val), z.number().optional()),
    validUntil: z.string().optional(),
    isActive: z.boolean().default(false).optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.isActive) return;
    if (!data.name?.trim())
      ctx.addIssue({ code: 'custom', message: 'Offer name is required when active', path: ['name'] });
    if (!data.type)
      ctx.addIssue({ code: 'custom', message: 'Offer type is required when active', path: ['type'] });
    if (data.value === undefined || data.value <= 0)
      ctx.addIssue({ code: 'custom', message: 'Offer value must be greater than 0', path: ['value'] });
    if (data.type === 'percentage' && data.value! > 100)
      ctx.addIssue({ code: 'custom', message: 'Percentage offer value cannot exceed 100', path: ['value'] });
    if (!data.validUntil)
      ctx.addIssue({ code: 'custom', message: 'Offer valid until date is required', path: ['validUntil'] });
    else if (new Date(data.validUntil) <= new Date())
      ctx.addIssue({ code: 'custom', message: 'Offer expiry date must be in the future', path: ['validUntil'] });
  });

// ---------------- ACTIVITY ----------------
export const activitySchema = z
  .object({
    startTime: z.string().trim().regex(timeRegex, 'Start time must be in HH:mm format'),
    endTime: z.string().trim().regex(timeRegex, 'End time must be in HH:mm format'),
    activity: z.string().trim().min(3, 'Activity must be at least 3 characters'),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: 'End time must be after start time',
    path: ['endTime'],
  });

// ---------------- ITINERARY ----------------
export const itineraryDaySchema = z.object({
  day: z.number().min(1, 'Day number must be at least 1'),
  title: z.string().trim().min(1, 'Day title is required'),
  description: z.string().trim().min(3, 'Description must be at least 3 characters').optional(),
  activities: z.array(activitySchema).min(1, 'At least one activity is required'),
});

// ---------------- BASE PACKAGE ----------------
const packageBaseSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters'),
  description: z.string().trim().min(10, 'Description must be at least 10 characters'),
  ageOfAdult: z.coerce.number().positive('age of Adult must be greater than 0'),
  ageOfChild: z.coerce.number().positive('age of child must be greater than 0'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  pricePerChild: z.coerce.number().positive('Child price must be greater than 0').optional(),
  durationDays: z.coerce.number().min(1, 'Duration (days) is required'),
  durationNights: z.coerce.number().min(0, 'Duration (nights) is required'),
  category: z.array(z.string().trim()).min(1, 'At least one category is required'),
  startPoint: z.string().trim().min(3, 'Starting point must be at least 3 characters'),
  location: z.array(
    z.object({
      name: z.string().trim().min(2, 'Location name must be at least 2 characters'),
      lat: z.string().regex(latRegex, 'Latitude must be between -90 and 90'),
      lng: z.string().regex(lngRegex, 'Longitude must be between -180 and 180'),
    })
  ).min(1, 'At least one location is required'),
  included: z.array(z.string().trim().min(1, 'Included item cannot be empty')),
  notIncluded: z.array(z.string().trim().min(1, 'Not Included item cannot be empty')),
  itinerary: z.array(itineraryDaySchema),
  images: z.array(z.instanceof(File)).min(1, 'At least 1 image is required'),
  offer: offerSchema.optional(),
  packageType: z.enum(['normal', 'custom', 'group'], { required_error: 'Package type is required' }),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  departureDates: z.string().optional(),
  groupSize: z.coerce.number().optional(),
  availableSlots: z.coerce.number().optional(),
});

// ---------------- CONDITIONAL VALIDATION ----------------
export const addPackageSchema = packageBaseSchema.superRefine((data, ctx) => {
 
  // Validate based on package type
  if (data.packageType === 'normal') {
    if (!data.startDate)
      ctx.addIssue({ code: 'custom', message: 'Start date is required for normal packages', path: ['startDate'] });
    if (!data.endDate)
      ctx.addIssue({ code: 'custom', message: 'End date is required for normal packages', path: ['endDate'] });
    if (data.startDate && data.endDate && new Date(data.endDate) < new Date(data.startDate))
      ctx.addIssue({ code: 'custom', message: 'End date must be after start date', path: ['endDate'] });
  }

  if (data.ageOfAdult <= data.ageOfChild) {
    ctx.addIssue({ code: 'custom', message: 'adult age must be greater than child age', path: ['ageOfAdult'] });

  }
  
  if (data.packageType === 'custom') {
    if (!data.departureDates)
      ctx.addIssue({
        code: 'custom',
        message: 'Departure date is required for custom packages',
        path: ['departureDates'],
      });
    else if (new Date(data.departureDates) < new Date())
      ctx.addIssue({
        code: 'custom',
        message: 'Departure date must be in the future',
        path: ['departureDates'],
      });
  }

  if (data.packageType === 'group') {
    if (!data.departureDates)
      ctx.addIssue({
        code: 'custom',
        message: 'Departure dates are required for group packages',
        path: ['departureDates'],
      });

    if (!data.groupSize || data.groupSize <= 0)
      ctx.addIssue({
        code: 'custom',
        message: 'Group size must be greater than 0',
        path: ['groupSize'],
      });

    else if (new Date(data.departureDates!) < new Date())
      ctx.addIssue({
        code: 'custom',
        message: 'Departure date must be in the future',
        path: ['departureDates'],
      });
  }

  // Common validations
  if (data.itinerary.length !== data.durationDays)
    ctx.addIssue({ code: 'custom', message: `Itinerary must have exactly ${data.durationDays} day(s)`, path: ['itinerary'] });

  if (data.durationNights > data.durationDays)
    ctx.addIssue({ code: 'custom', message: 'Nights cannot be more than days', path: ['durationNights'] });

  if (data.durationDays - data.durationNights > 1)
    ctx.addIssue({ code: 'custom', message: 'Nights should be equal to or one less than days', path: ['durationNights'] });
});

export type AddPackageFormSchema = z.infer<typeof addPackageSchema>;

// ---------------- EDIT SCHEMA ----------------


//  Edit Package Schema
export const editPackageSchema = packageBaseSchema
  .extend({
    images: z.array(z.instanceof(File)).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.itinerary.length !== data.durationDays) {
      ctx.addIssue({ code: 'custom', message: `Itinerary must have exactly ${data.durationDays} day(s)`, path: ['itinerary'] });
    }
    if (data.durationNights > data.durationDays) {
      ctx.addIssue({ code: 'custom', message: 'Nights cannot be more than days', path: ['durationNights'] });
    }
    if (data.durationDays - data.durationNights > 1) {
      ctx.addIssue({ code: 'custom', message: 'Nights should be equal to or one less than days', path: ['durationNights'] });
    }
    if (new Date(data?.endDate!) < new Date(data.startDate!)) {
      ctx.addIssue({ code: 'custom', message: 'End date must be after start date', path: ['endDate'] });
    }
    if (data.packageType === 'normal') {
    if (!data.startDate)
      ctx.addIssue({ code: 'custom', message: 'Start date is required for normal packages', path: ['startDate'] });
    if (!data.endDate)
      ctx.addIssue({ code: 'custom', message: 'End date is required for normal packages', path: ['endDate'] });
    if (data.startDate && data.endDate && new Date(data.endDate) < new Date(data.startDate))
      ctx.addIssue({ code: 'custom', message: 'End date must be after start date', path: ['endDate'] });
  }

  if (data.ageOfAdult <= data.ageOfChild) {
    ctx.addIssue({ code: 'custom', message: 'adult age must be greater than child age', path: ['ageOfAdult'] });

  }
  
  if (data.packageType === 'custom') {
    if (!data.departureDates)
      ctx.addIssue({
        code: 'custom',
        message: 'Departure date is required for custom packages',
        path: ['departureDates'],
      });
    else if (new Date(data.departureDates) < new Date())
      ctx.addIssue({
        code: 'custom',
        message: 'Departure date must be in the future',
        path: ['departureDates'],
      });
  }

  if (data.packageType === 'group') {
    if (!data.departureDates)
      ctx.addIssue({
        code: 'custom',
        message: 'Departure dates are required for group packages',
        path: ['departureDates'],
      });

    if (!data.groupSize || data.groupSize <= 0)
      ctx.addIssue({
        code: 'custom',
        message: 'Group size must be greater than 0',
        path: ['groupSize'],
      });

    else if (new Date(data.departureDates!) < new Date())
      ctx.addIssue({
        code: 'custom',
        message: 'Departure date must be in the future',
        path: ['departureDates'],
      });
  }

  });

export type EditPackageFormSchema = z.infer<typeof editPackageSchema>;
