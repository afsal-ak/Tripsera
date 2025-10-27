// import { z } from 'zod';

// // Helper regex for time validation (HH:mm format)
// const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
// const latRegex = /^-?([0-8]?\d(\.\d+)?|90(\.0+)?)$/; // -90 to 90
// const lngRegex = /^-?(180(\.0+)?|((1[0-7]\d)|([0-9]?\d))(\.\d+)?)$/; // -180 to 180

// // Offer schema
// export const offerSchema = z
//   .object({
//     name: z.string().trim().min(1, 'Offer name is required'), // added offer name
//     type: z.enum(['percentage', 'flat']).refine((val) => !!val, {
//       message: 'Offer type is required',
//     }),

//     value: z.coerce
//       .number({
//         required_error: 'Offer value is required',
//         invalid_type_error: 'Offer value must be a valid number',
//       })
//       .min(1, { message: 'Offer value must be at least 1' })
//       .max(10000, { message: 'Offer value too high' }),

//     validUntil: z.string().nonempty({ message: 'Offer expiry date is required' }),
//     isActive: z.boolean(),
//   })
//   .refine((data) => !(data.type === 'percentage' && data.value > 100), {
//     message: 'Percentage cannot be more than 100',
//     path: ['value'],
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
//     path: ['endTime'], // attach error to endTime field
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

// // 🔹 Base schema (plain z.object, no superRefine)
// const packageBaseSchema = z.object({
//   title: z.string().trim().min(3, { message: 'Title must be at least 3 characters' }),
//   description: z.string().trim().min(10, { message: 'Description must be at least 10 characters' }),

//   price: z.coerce
//     .number({
//       required_error: 'Price is required',
//       invalid_type_error: 'Price must be a number',
//     })
//     .positive({ message: 'Price must be greater than 0' }),

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

//   category: z
//     .array(z.string().trim().min(1, 'Category cannot be empty'))
//     .min(1, 'At least one category is required'),

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

// export const addPackageSchema = packageBaseSchema.superRefine((data, ctx) => {
//   // Itinerary length validation
//   if (data.itinerary.length !== data.durationDays) {
//     ctx.addIssue({
//       code: 'custom',
//       message: `Itinerary must have exactly ${data.durationDays} day(s)`,
//       path: ['itinerary'],
//     });
//   }

//   // Days vs Nights validation
//   if (data.durationNights > data.durationDays) {
//     ctx.addIssue({
//       code: 'custom',
//       message: 'Nights cannot be more than days',
//       path: ['durationNights'],
//     });
//   }
//   if (data.durationDays - data.durationNights > 1) {
//     ctx.addIssue({
//       code: 'custom',
//       message: 'Nights should be equal to or one less than days',
//       path: ['durationNights'],
//     });
//   }

//   // Dates validation
//   if (new Date(data.endDate) < new Date(data.startDate)) {
//     ctx.addIssue({
//       code: 'custom',
//       message: 'End date must be after start date',
//       path: ['endDate'],
//     });
//   }

//   // Offer validations
//   if (data.offer?.isActive) {
//     const today = new Date();
//     const validDate = new Date(data.offer.validUntil);

//     if (isNaN(validDate.getTime()) || validDate <= today) {
//       ctx.addIssue({
//         code: 'custom',
//         message: 'Offer expiry date must be a valid future date',
//         path: ['offer', 'validUntil'],
//       });
//     }

//     if (data.offer.value <= 0) {
//       ctx.addIssue({
//         code: 'custom',
//         message: 'Offer value must be greater than 0',
//         path: ['offer', 'value'],
//       });
//     }

//     if (!data.offer.name?.trim()) {
//       ctx.addIssue({
//         code: 'custom',
//         message: 'Offer name is required',
//         path: ['offer', 'name'],
//       });
//     }
//   }
// });

// export type AddPackageFormSchema = z.infer<typeof addPackageSchema>;

// // Edit package schema (reuse base, more flexible)
// export const editPackageSchema = packageBaseSchema
//   .extend({
//     images: z.array(z.instanceof(File)).optional(),
//   })
//   .superRefine((data, ctx) => {
//     // Same rules as add
//     if (data.itinerary.length !== data.durationDays) {
//       ctx.addIssue({
//         code: 'custom',
//         message: `Itinerary must have exactly ${data.durationDays} day(s)`,
//         path: ['itinerary'],
//       });
//     }

//     if (data.durationNights > data.durationDays) {
//       ctx.addIssue({
//         code: 'custom',
//         message: 'Nights cannot be more than days',
//         path: ['durationNights'],
//       });
//     }
//     if (data.durationDays - data.durationNights > 1) {
//       ctx.addIssue({
//         code: 'custom',
//         message: 'Nights should be equal to or one less than days',
//         path: ['durationNights'],
//       });
//     }

//     if (new Date(data.endDate) < new Date(data.startDate)) {
//       ctx.addIssue({
//         code: 'custom',
//         message: 'End date must be after start date',
//         path: ['endDate'],
//       });
//     }

//     if (data.offer?.isActive) {
//       const today = new Date();
//       const validDate = new Date(data.offer.validUntil);

//       if (isNaN(validDate.getTime()) || validDate <= today) {
//         ctx.addIssue({
//           code: 'custom',
//           message: 'Offer expiry date must be a valid future date',
//           path: ['offer', 'validUntil'],
//         });
//       }

//       if (data.offer.value <= 0) {
//         ctx.addIssue({
//           code: 'custom',
//           message: 'Offer value must be greater than 0',
//           path: ['offer', 'value'],
//         });
//       }

//       if (!data.offer.name?.trim()) {
//         ctx.addIssue({
//           code: 'custom',
//           message: 'Offer name is required',
//           path: ['offer', 'name'],
//         });
//       }
//     }
//   });

// export type EditPackageFormSchema = z.infer<typeof editPackageSchema>;
// import { z } from 'zod';

// // ✅ Regex helpers
// const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
// const latRegex = /^-?([0-8]?\d(\.\d+)?|90(\.0+)?)$/; // -90 to 90
// const lngRegex = /^-?(180(\.0+)?|((1[0-7]\d)|([0-9]?\d))(\.\d+)?)$/; // -180 to 180

// // ✅ Offer schema (Optional + Conditional Validation)
// export const offerSchema = z
//   .object({
//     name: z.string().trim().optional(),
//     type: z.enum(['percentage', 'flat']).optional(),
//     value: z.preprocess((val) => Number(val), z.number().optional()),
//     validUntil: z.string().optional(),
//     isActive: z.boolean().default(false).optional(),
//   })
//   .refine(
//     (data) => {
//       // ✅ Skip validation entirely if offer is NOT active
//       if (!data.isActive) return true;

//       // ✅ If active, require all fields
//       return (
//         !!data.name?.trim() &&
//         !!data.type &&
//         typeof data.value === 'number' &&
//         data.value > 0 &&
//         !!data.validUntil
//       );
//     },
//     {
//       message:
//         'If offer is active, please fill all fields: name, type, value, and valid until date.',
//       path: ['offer'],
//     }
//   )
//   .refine(
//     (data) => {
//       if (data.isActive && data.type === 'percentage' && data.value && data.value > 100)
//         return false;
//       return true;
//     },
//     {
//       message: 'Percentage offer value cannot exceed 100',
//       path: ['offer', 'value'],
//     }
//   )
//   .refine(
//     (data) => {
//       if (data.isActive && data.validUntil) {
//         const validDate = new Date(data.validUntil);
//         return validDate > new Date();
//       }
//       return true;
//     },
//     {
//       message: 'Offer expiry date must be a valid future date',
//       path: ['offer', 'validUntil'],
//     }
//   );

// // ✅ Activity schema
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

// // ✅ Itinerary day schema
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

// // ✅ Base package schema
// const packageBaseSchema = z.object({
//   title: z.string().trim().min(3, { message: 'Title must be at least 3 characters' }),
//   description: z.string().trim().min(10, { message: 'Description must be at least 10 characters' }),

//   price: z.coerce
//     .number({
//       required_error: 'Price is required',
//       invalid_type_error: 'Price must be a number',
//     })
//     .positive({ message: 'Price must be greater than 0' }),

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

//   category: z
//     .array(z.string().trim().min(1, 'Category cannot be empty'))
//     .min(1, 'At least one category is required'),

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

// // ✅ Add Package Schema
// export const addPackageSchema = packageBaseSchema.superRefine((data, ctx) => {
//   if (data.itinerary.length !== data.durationDays) {
//     ctx.addIssue({
//       code: 'custom',
//       message: `Itinerary must have exactly ${data.durationDays} day(s)`,
//       path: ['itinerary'],
//     });
//   }

//   if (data.durationNights > data.durationDays) {
//     ctx.addIssue({
//       code: 'custom',
//       message: 'Nights cannot be more than days',
//       path: ['durationNights'],
//     });
//   }

//   if (data.durationDays - data.durationNights > 1) {
//     ctx.addIssue({
//       code: 'custom',
//       message: 'Nights should be equal to or one less than days',
//       path: ['durationNights'],
//     });
//   }

//   if (new Date(data.endDate) < new Date(data.startDate)) {
//     ctx.addIssue({
//       code: 'custom',
//       message: 'End date must be after start date',
//       path: ['endDate'],
//     });
//   }
// });

// export type AddPackageFormSchema = z.infer<typeof addPackageSchema>;

// // ✅ Edit Package Schema
// export const editPackageSchema = packageBaseSchema
//   .extend({
//     images: z.array(z.instanceof(File)).optional(),
//   })
//   .superRefine((data, ctx) => {
//     if (data.itinerary.length !== data.durationDays) {
//       ctx.addIssue({
//         code: 'custom',
//         message: `Itinerary must have exactly ${data.durationDays} day(s)`,
//         path: ['itinerary'],
//       });
//     }

//     if (data.durationNights > data.durationDays) {
//       ctx.addIssue({
//         code: 'custom',
//         message: 'Nights cannot be more than days',
//         path: ['durationNights'],
//       });
//     }

//     if (data.durationDays - data.durationNights > 1) {
//       ctx.addIssue({
//         code: 'custom',
//         message: 'Nights should be equal to or one less than days',
//         path: ['durationNights'],
//       });
//     }

//     if (new Date(data.endDate) < new Date(data.startDate)) {
//       ctx.addIssue({
//         code: 'custom',
//         message: 'End date must be after start date',
//         path: ['endDate'],
//       });
//     }
//   });

// export type EditPackageFormSchema = z.infer<typeof editPackageSchema>;
import { z } from 'zod';

// ✅ Regex helpers
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
const latRegex = /^-?([0-8]?\d(\.\d+)?|90(\.0+)?)$/; // -90 to 90
const lngRegex = /^-?(180(\.0+)?|((1[0-7]\d)|([0-9]?\d))(\.\d+)?)$/; // -180 to 180

export const offerSchema = z
  .object({
    name: z.string().trim().optional(),
    type: z.enum(['percentage', 'flat']).optional(),
    value: z.preprocess((val) => Number(val), z.number().optional()),
    validUntil: z.string().optional(),
    isActive: z.boolean().default(false).optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.isActive) return; // skip if not active

    // ✅ Name required
    if (!data.name?.trim()) {
      ctx.addIssue({
        code: 'custom',
        message: 'Offer name is required when active',
        path: ['name'],
      });
    }

    // ✅ Type required
    if (!data.type) {
      ctx.addIssue({
        code: 'custom',
        message: 'Offer type is required when active',
        path: ['type'],
      });
    }

    // ✅ Value required
    if (data.value === undefined || data.value <= 0) {
      ctx.addIssue({
        code: 'custom',
        message: 'Offer value must be greater than 0 when active',
        path: ['value'],
      });
    }

    // ✅ Percentage max 100
    if (data.type === 'percentage' && data.value && data.value > 100) {
      ctx.addIssue({
        code: 'custom',
        message: 'Percentage offer value cannot exceed 100',
        path: ['value'],
      });
    }

    // ✅ Valid Until required and future date
    if (!data.validUntil) {
      ctx.addIssue({
        code: 'custom',
        message: 'Offer valid until date is required',
        path: ['validUntil'],
      });
    } else {
      const validDate = new Date(data.validUntil);
      if (validDate <= new Date()) {
        ctx.addIssue({
          code: 'custom',
          message: 'Offer expiry date must be a future date',
          path: ['validUntil'],
        });
      }
    }
  });


// ✅ Activity schema
export const activitySchema = z
  .object({
    startTime: z
      .string()
      .trim()
      .min(1, 'Start time is required')
      .regex(timeRegex, 'Start time must be in HH:mm format'),
    endTime: z
      .string()
      .trim()
      .min(1, 'End time is required')
      .regex(timeRegex, 'End time must be in HH:mm format'),
    activity: z.string().trim().min(3, 'Activity must be at least 3 characters'),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: 'End time must be after start time',
    path: ['endTime'],
  });

// ✅ Itinerary day schema
export const itineraryDaySchema = z.object({
  day: z
    .number({
      required_error: 'Day number is required',
      invalid_type_error: 'Day must be a number',
    })
    .min(1, 'Day number must be at least 1'),
  title: z.string().trim().min(1, 'Day title is required'),
  description: z.string().trim().min(3, 'Description must be at least 3 characters').optional(),
  activities: z.array(activitySchema).min(1, 'At least one activity is required'),
});

// ✅ Base package schema
const packageBaseSchema = z.object({
  title: z.string().trim().min(3, { message: 'Title must be at least 3 characters' }),
  description: z.string().trim().min(10, { message: 'Description must be at least 10 characters' }),
  price: z.coerce
    .number({
      required_error: 'Price is required',
      invalid_type_error: 'Price must be a number',
    })
    .positive({ message: 'Price must be greater than 0' }),
  durationDays: z.coerce
    .number({
      required_error: 'Duration (days) is required',
      invalid_type_error: 'Please enter a valid number of days',
    })
    .min(1, { message: 'Days must be at least 1' }),
  durationNights: z.coerce
    .number({
      required_error: 'Duration (nights) is required',
      invalid_type_error: 'Please enter a valid number of nights',
    })
    .min(0, { message: 'Nights must be at least 0' }),
  startDate: z.string().nonempty({ message: 'Start date is required' }),
  endDate: z.string().nonempty({ message: 'End date is required' }),
  category: z.array(z.string().trim().min(1, 'Category cannot be empty')).min(1, 'At least one category is required'),
  startPoint: z.string().trim().min(3, { message: 'Starting point must be at least 3 characters' }),
  location: z
    .array(
      z.object({
        name: z.string().trim().min(2, { message: 'Location name must be at least 2 characters' }),
        lat: z.string().regex(latRegex, 'Latitude must be between -90 and 90'),
        lng: z.string().regex(lngRegex, 'Longitude must be between -180 and 180'),
      })
    )
    .min(1, { message: 'At least 1 location is required' }),
  included: z.array(z.string().trim().min(1, { message: 'Included item cannot be empty' })),
  notIncluded: z.array(z.string().trim().min(1, { message: 'Not Included item cannot be empty' })),
  itinerary: z.array(itineraryDaySchema),
  images: z.array(z.instanceof(File)).min(1, { message: 'At least 1 image is required' }),
  offer: offerSchema.optional(),
});

//  Add Package Schema
export const addPackageSchema = packageBaseSchema.superRefine((data, ctx) => {
  if (data.itinerary.length !== data.durationDays) {
    ctx.addIssue({ code: 'custom', message: `Itinerary must have exactly ${data.durationDays} day(s)`, path: ['itinerary'] });
  }
  if (data.durationNights > data.durationDays) {
    ctx.addIssue({ code: 'custom', message: 'Nights cannot be more than days', path: ['durationNights'] });
  }
  if (data.durationDays - data.durationNights > 1) {
    ctx.addIssue({ code: 'custom', message: 'Nights should be equal to or one less than days', path: ['durationNights'] });
  }
  if (new Date(data.endDate) < new Date(data.startDate)) {
    ctx.addIssue({ code: 'custom', message: 'End date must be after start date', path: ['endDate'] });
  }
});

export type AddPackageFormSchema = z.infer<typeof addPackageSchema>;

// ✅ Edit Package Schema
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
    if (new Date(data.endDate) < new Date(data.startDate)) {
      ctx.addIssue({ code: 'custom', message: 'End date must be after start date', path: ['endDate'] });
    }
  });

export type EditPackageFormSchema = z.infer<typeof editPackageSchema>;
