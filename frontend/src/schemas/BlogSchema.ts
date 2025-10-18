import z from 'zod';

const imageFileSchema = z.instanceof(File).refine((file) => file.size <= 5 * 1024 * 1024, {
  message: 'Image size must be less than 5MB',
});

export const blogSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .transform((val) => val.trim()),

  content: z
    .string()
    .min(10, 'Content must be at least 10 characters')
    .transform((val) => val.trim()),

  tags: z.array(z.string().transform((tag) => tag.trim())).optional(),

  status: z
    .enum(['draft', 'published', 'archived'], {
      required_error: 'Status is required',
    })
    .optional(),

  images: z
    .array(imageFileSchema)
    .min(1, 'At least one image is required')
    .max(4, 'You can upload a maximum of 4 images'),
});

export type BlogFormSchema = z.infer<typeof blogSchema>;
