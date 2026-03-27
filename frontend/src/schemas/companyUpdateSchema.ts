import { z } from "zod"

export const companyUpdateSchema = z.object({

  name: z
    .string()
    .min(2, "Company name must be at least 2 characters"),

  email: z
    .string()
    .email("Invalid email"),

  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Phone must be a valid 10 digit Indian number"),

  description: z
    .string()
    .max(500, "Description too long")
    .optional(),

//   website: z
//     .string()
//     .url("Invalid website URL")
//     .optional()
//     .or(z.literal("")),

  street: z.string().min(2, "Street required"),

  city: z.string().min(2, "City required"),

  state: z.string().min(2, "State required"),

  postalCode: z
    .string(),
    //.regex(/^[1-9][0-9]{5}$/, "Invalid postal code"),

  gstNumber: z
    .string()
    // .regex(
    //   /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/,
    //   "Invalid GST number"
   // )
    .optional()
    .or(z.literal("")),

  licenseNumber: z
    .string()
    .min(5, "License number too short")
    .optional()
    .or(z.literal(""))

})

export type CompanyUpdateFormData =
  z.infer<typeof companyUpdateSchema>