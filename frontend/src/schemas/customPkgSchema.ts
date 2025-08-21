// import { z } from "zod";


// export const customPkgSchema = z.object({

//     destination: z
//         .string()
//         .trim()
//         .min(3, { message: "Destination must be at least 3 characters long" }),


//         tripType: z.enum(["romantic", "adventure", "family", "luxury", "budget", "other"], {
//         required_error: "Please select a trip type"
//     }),


//     otherTripType: z
//         .string()
//         .trim()
//         .optional()
//         .refine(
//             (val) => val === undefined || val.length >= 3,
//             "Other trip type must be at least 3 characters"
//         ),


//         budget: z
//         .number({ invalid_type_error: "Budget must be a number" })
//         .min(1, { message: "Budget must be greater than 0" }),
 

//         startDate: z
//         .string(),
//         // .refine((date) => !isNaN(Date.parse(val)), {
//         //     message: "Start date must be a valid date"
//         // })
//         // .transform((val) => new Date(val))
//         // .refine((date) => date > new Date(), {
//         //     message: "Start date must be in the future"
//         // }),


//         days: z
//         .number({ invalid_type_error: "Days must be a number" })
//         .int({ message: "Days must be an integer" })
//         .min(1, { message: "Days must be at least 1" }),


//         nights: z
//         .number({ invalid_type_error: "Nights must be a number" })
//         .int({ message: "Nights must be an integer" })
//         .min(0, { message: "Nights cannot be negative" }),


//         adults: z
//         .number({ invalid_type_error: "Adults must be a number" })
//         .int({ message: "Adults must be an integer" })
//         .min(1, { message: "There must be at least 1 adult" }),


//         children: z
//         .number({ invalid_type_error: "Children must be a number" })
//         .int({ message: "Children must be an integer" })
//         .min(0, { message: "Children cannot be negative" })
//         .optional(),


//         accommodation: z.enum(["luxury", "standard", "budget"], {
//         required_error: "Please select an accommodation type"
//     }),


//     additionalDetails: z
//         .string()
//         .trim()
//         .max(1000, { message: "Additional details cannot exceed 1000 characters" })
//         .optional(),


//         guestInfo: z
//         .object({
//             name: z
//                 .string()
//                 .trim()
//                 .min(2, { message: "Guest name must be at least 2 characters" })
//                 .optional(),
//             email: z
//                 .string()
//                 .trim()
//                 .email({ message: "Invalid email address" })
//                 .optional(),
//             phone: z
//                 .string()
//                 .trim()
//                 .regex(/^[0-9]{10}$/, { message: "Phone must be a 10-digit number" })
//                 .optional()
//         })
//         .optional()
// });

// export type CustomPkgFormSchema = z.infer<typeof customPkgSchema>;
// src/schemas/customPkgSchema.ts
import { z } from "zod";

export const customPkgSchema = z.object({
  destination: z
    .string()
    .trim()
    .min(3, { message: "Destination must be at least 3 characters" }),
  tripType: z.enum([
    "romantic",
    "adventure",
    "family",
    "luxury",
    "budget",
    "other",
  ]),
  budget: z
    .number({
      required_error: "Budget is required",
      invalid_type_error: "Budget must be a number",
    })
    .positive({ message: "Budget must be greater than 0" }),
  startDate: z.string().nonempty({ message: "Start date is required" }),
   days: z.number().min(1, { message: "Days must be at least 1" }),
  nights: z.number().min(0, { message: "Nights must be at least 0" }),
  adults: z.number().min(1, { message: "At least 1 adult is required" }),
  children: z.number().min(0).optional(),
  accommodation: z.enum(["luxury", "standard", "budget"]),
  additionalDetails: z.string().optional(),
  otherTripType: z.string().optional(),
  guestInfo: z
    .object({
      name: z
        .string()
        .trim()
        .min(2, { message: " name must be at least 2 characters" })
        .optional(),
      email: z
        .string()
        .trim()
        .email({ message: "Invalid email address" })
        .optional(),
      phone: z
        .string()
        .trim()
        .regex(/^[0-9]{10}$/, { message: "Phone must be a 10-digit number" })
        .optional(),
    })
    .optional(),
});

export const customPkgCreateSchema = customPkgSchema;
export const customPkgEditSchema = customPkgSchema.partial();

export type CustomPkgFormSchema = z.infer<typeof customPkgSchema>;
 
export const editCustomPkgSchema = customPkgSchema.partial();

export type EditCustomPkgFormSchema = z.infer<typeof editCustomPkgSchema>;
