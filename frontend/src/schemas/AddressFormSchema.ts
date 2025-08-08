import z from 'zod';

const noNumericOnly = (field: string) => !/^\d+$/.test(field);

export const AddressSchema = z.object({
  street: z
    .string()
    .min(3, 'Street must be at least 3 characters')
    .transform((val) => val.trim()),

  city: z
    .string()
    .min(2, 'City must be at least 2 characters')
    .refine(noNumericOnly, {
      message: 'City cannot be only numbers',
    })
    .transform((val) => val.trim()),

  state: z
    .string()
    .min(3, 'State must be at least 3 characters')
    .refine(noNumericOnly, {
      message: 'State cannot be only numbers',
    })
    .transform((val) => val.trim()),

  zip: z
    .string()
    .regex(/^\d{6}$/, {
      message: 'PIN must be exactly 6 digits',
    })
    .transform((val) => val.trim()),

  country: z
    .string()
    .min(3, 'Country must be at least 3 characters')
    .refine((val) => !/\d/.test(val), {
      message: 'Country must not contain numbers',
    })
    .transform((val) => val.trim()),
});

export type AddressFormSchema = z.infer<typeof AddressSchema>;
