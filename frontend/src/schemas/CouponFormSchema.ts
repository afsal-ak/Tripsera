import z from 'zod';

export const couponSchema = z
  .object({
    code: z
      .string()
      .transform((val) => val.trim())
      .refine((val) => val.length >= 3, {
        message: 'Code must be at least 3 characters',
      }),

    type: z.enum(['percentage', 'flat']),

    discountValue: z
      .number({
        required_error: 'Discount value is required',
        invalid_type_error: 'Discount must be a number',
      })
      .min(1, 'Discount must be at least 1'),

    expiryDate: z
      .string()
      .refine((date) => new Date(date) > new Date(), 'Expiry must be in the future'),

    minAmount: z
      .number({
        required_error: 'Minimum amount value is required',
        invalid_type_error: 'Minimum amount must be a number',
      })
      .min(1, 'Minimum amount must be at least 1'),

    maxDiscountAmount: z
      .number({
        required_error: 'Max discount value is required',
        invalid_type_error: 'Max discount must be a number',
      })
      .min(1, 'Max discount must be at least 1'),
  })
  .refine(
    (data) => {
      if (data.type === 'percentage') {
        return data.discountValue <= 100;
      }
      return true;
    },
    {
      message: 'Percentage discount cannot be more than 100',
      path: ['discountValue'],
    }
  );

export type CouponFormSchema = z.infer<typeof couponSchema>;
