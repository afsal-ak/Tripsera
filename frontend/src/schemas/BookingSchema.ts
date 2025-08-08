import { z } from 'zod';

const today = new Date();
today.setHours(0, 0, 0, 0);

export const TravelerSchema = z.object({
  // fullName: z.string().min(1, "Full name is required"),
  fullName: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val.length >= 3, {
      message: 'name must be at least 3 characters',
    }),
  age: z.number({ invalid_type_error: 'Age must be a number' }).min(1, 'Invalid age'),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Gender is required',
  }),
  id: z.string().min(3, 'Government ID (Passport/Aadhaar) is required'),
});

export const BookingSchema = z.object({
  packageId: z.string().min(1, 'Package ID is required'),

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
