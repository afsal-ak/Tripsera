import z from 'zod';

export const ProfileSchema = z.object({
  fullName: z.string().trim().min(3, 'Full name must be at least 3 characters'),

  username: z
    .string()
    .min(1, { message: 'Username is required' })
    .max(20, { message: 'Username must be at most 30 characters' })
    .regex(/^(?!.*\.\.)(?!.*\.$)[a-zA-Z0-9._]+$/, {
      message:
        'Only letters, numbers, underscores, and periods are allowed. Cannot end with a dot or have consecutive dots.',
    }),

  dob: z
    .string()
    .refine((date) => new Date(date) < new Date(), {
      message: 'Please enter a valid date of birth',
    })
    .optional(),

  gender: z
    .enum(['male', 'female'], {
      required_error: 'Gender is required',
    })
    .optional(),

  bio: z.string().trim().min(5, 'Bio must be at least 5 characters').optional(),

  phone: z
    .string()
    .trim()
    .regex(/^\d{10}$/, {
      message: 'Phone number must be exactly 10 digits',
    }),

  links: z
    .array(
      z.object({
        platform: z.enum(['Instagram', 'YouTube', 'Twitter', 'Facebook', 'LinkedIn'], {
          errorMap: () => ({ message: 'Invalid platform selected' }),
        }),
        url: z.string().url('Enter a valid URL'),
      })
    )
    .optional(),
});

export type ProfileFormSchema = z.infer<typeof ProfileSchema>;
