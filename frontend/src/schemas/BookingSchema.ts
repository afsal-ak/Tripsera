import { z } from 'zod';

const today = new Date();
today.setHours(0, 0, 0, 0);

export const TravelerSchema = z
  .object({
    fullName: z.string().trim().min(3, 'Name must be at least 3 characters'),
    age: z.number({ invalid_type_error: 'Age must be a number' }).min(1, 'Invalid age'),
    gender: z.enum(['male', 'female', 'other'], {
      required_error: 'Gender is required',
    }),

    idType: z.enum(['aadhaar', 'pan', 'passport']).optional(),

    idNumber: z.string().trim(),
  })
  .superRefine((data, ctx) => {
    const { idType, idNumber } = data;

    if (idType === 'aadhaar' && !/^\d{12}$/.test(idNumber)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['idNumber'],
        message: 'Aadhaar must be 12 digits',
      });
    }

    if (idType === 'pan' && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(idNumber)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['idNumber'],
        message: 'PAN must be in format ABCDE1234F',
      });
    }

    if (idType === 'passport' && !/^[A-PR-WYa-pr-wy][1-9]\d{6}[1-9]$/.test(idNumber)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['idNumber'],
        message: 'Passport must be valid (e.g., A1234567)',
      });
    }
  });
export const BookingSchema = z.object({
  packageId: z.string().min(1, 'Package ID is required'),
  packageType:z.string().min(1, 'Package Type is required'),
  travelDate: z.string().refine(
    (date) => {
      const selected = new Date(date);
      selected.setHours(0, 0, 0, 0);

      const minAllowed = new Date();
      minAllowed.setHours(0, 0, 0, 0);
      minAllowed.setDate(minAllowed.getDate() + 2);

      return selected >= minAllowed;
    },
    {
      message: 'Travel date must be at least 2 days from today',
    }
  ),
  travelers: z.array(TravelerSchema).min(1, 'At least one traveler is required'),

  contactDetails: z.object({
    name: z
      .string()
      .transform((val) => val.trim())
      .refine((val) => val.length >= 3, {
        message: 'name must be at least 3 characters',
      }),
    phone: z
      .string()
      .trim()
      .regex(/^\d{10}$/, {
        message: 'Phone number must be exactly 10 digits',
      }),
    alternatePhone: z
      .string()
      .trim()
      .regex(/^\d{10}$/, {
        message: 'Phone number must be exactly 10 digits',
      }),
    email: z.string().email('Invalid email address'),
  }).refine((data) => data.phone !== data.alternatePhone, {
    message: 'Primary and alternate phone numbers cannot be the same',
    path: ['alternatePhone'],  
  }),

  totalAmount: z
    .number({ required_error: 'Total amount is required' })
    .min(1, 'Total amount must be at least 1'),

  couponCode: z.string().optional(),
  discount: z.number().optional(),
  useWallet: z.boolean().optional(),
  walletAmountUsed: z.number().optional(),
  amountPaid: z.number().optional(),

  paymentMethod: z.enum(['wallet', 'razorpay', 'wallet+razorpay', ''], {
    required_error: 'Please select a payment method',
  }),
});

export type BookingFormSchema = z.infer<typeof BookingSchema>;


 
export const TravelerBookingSchema = z.object({
  packageId: z.string().min(1, 'Package ID is required'),
  bookingId: z.string().min(1, 'bookingId ID is required'),
  packageType:z.string().min(1, 'Package Type is required'),

  travelDate: z.string().refine(
    (date) => {
      const selected = new Date(date);
      selected.setHours(0, 0, 0, 0);

      const minAllowed = new Date();
      minAllowed.setHours(0, 0, 0, 0);
      minAllowed.setDate(minAllowed.getDate() + 2);

      return selected >= minAllowed;
    },
    {
      message: 'Travel date must be at least 2 days from today',
    }
  ),

  travelers: z
    .array(TravelerSchema)
    .min(1, 'At least one traveler is required'),

  totalAmount: z
    .number({ required_error: 'Total amount is required' })
    .min(1, 'Total amount must be at least 1'),

  couponCode: z.string().optional(),
  discount: z.number().optional(),
  useWallet: z.boolean().optional(),
  walletAmountUsed: z.number().optional(),
  amountPaid: z.number().optional(),

  paymentMethod: z
    .enum(['wallet', 'razorpay', 'wallet+razorpay', ''], {
      required_error: 'Please select a payment method',
    })
    .optional(),
});

export type TravelerBookingFormSchema = z.infer<typeof TravelerBookingSchema>;
