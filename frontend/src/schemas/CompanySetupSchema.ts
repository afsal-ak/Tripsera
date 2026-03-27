import { z } from "zod";

export const companySetupSchema = z.object({

  name: z
    .string()
    .min(3, "Company name must be at least 3 characters"),

  email: z
    .string()
    .email("Invalid email address"),

  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter valid Indian phone number")
    .optional()
    .or(z.literal("")),

  street: z
    .string()
    .min(3, "Street is required"),

  city: z
    .string()
    .min(2, "City is required"),

  state: z
    .string()
    .min(2, "State is required"),

  postalCode: z
    .string()
    .regex(/^\d{6}$/, "Enter valid 6 digit PIN code"),

  gstNumber: z
    .string()
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/,
      "GST format: 32ABCDE1234F1Z5"
    )
    .optional()
    .or(z.literal("")),

  licenseNumber: z
    .string()
    .min(3, "License number too short")
    .optional()
    .or(z.literal(""))

});

export type CompanySetupFormData = z.infer<typeof companySetupSchema>;

// import { z } from "zod";

// export const companySetupSchema = z.object({
//   name: z.string().min(3, "Company name must be at least 3 characters"),
//   email: z.string().email("Invalid email"),
//   phone: z.string().min(10, "Phone number required"),
//   description: z.string().optional(),
//   website: z.string().optional(),
//   gstNumber: z.string().optional(),
//   licenseNumber: z.string().optional(),

//   street: z.string().min(2),
//   city: z.string().min(2),
//   state: z.string().min(2),
//   country: z.string().default("India"),
//   postalCode: z.string().min(4),
// });