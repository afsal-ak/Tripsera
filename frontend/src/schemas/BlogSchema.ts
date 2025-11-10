// // // import z from 'zod';

// // // const imageFileSchema = z.instanceof(File).refine((file) => file.size <= 5 * 1024 * 1024, {
// // //   message: 'Image size must be less than 5MB',
// // // });

// // // export const blogSchema = z.object({
// // //   title: z
// // //     .string()
// // //     .min(3, 'Title must be at least 3 characters')
// // //     .transform((val) => val.trim()),

// // //   content: z
// // //     .string()
// // //     .min(10, 'Content must be at least 10 characters')
// // //     .transform((val) => val.trim()),

// // //   tags: z.array(z.string().transform((tag) => tag.trim())).optional(),

// // //   status: z
// // //     .enum(['draft', 'published', 'archived'], {
// // //       required_error: 'Status is required',
// // //     })
// // //     .optional(),

// // //   images: z
// // //     .array(imageFileSchema)
// // //     .min(1, 'At least one image is required')
// // //     .max(4, 'You can upload a maximum of 4 images'),
// // // });

// // // export type BlogFormSchema = z.infer<typeof blogSchema>;
// // import z from 'zod';

// // const imageFileSchema = z
// //   .instanceof(File)
// //   .refine((file) => file.size <= 5 * 1024 * 1024, {
// //     message: 'Image size must be less than 5MB',
// //   });

// // // ✅ Schema for each blog section
// // const sectionSchema = z.object({
// //   title: z
// //     .string()
// //     .min(3, 'Section title must be at least 3 characters')
// //     .transform((val) => val.trim()),
// //   content: z
// //     .string()
// //     .min(10, 'Section content must be at least 10 characters')
// //     .transform((val) => val.trim()),
// //   image: imageFileSchema.optional(),
// // });

// // // ✅ Main Blog Schema
// // export const blogSchema = z.object({
// //   title: z
// //     .string()
// //     .min(3, 'Title must be at least 3 characters')
// //     .transform((val) => val.trim()),

// //   overview: z
// //     .string()
// //     .min(10, 'Overview must be at least 10 characters')
// //     .max(250, 'Overview cannot exceed 250 characters')
// //     .transform((val) => val.trim()),

// //   content: z
// //     .string()
// //     .min(20, 'Content must be at least 20 characters')
// //     .transform((val) => val.trim()),

// //   coverImage: imageFileSchema.refine((file) => !!file, {
// //     message: 'Cover image is required',
// //   }),

// //   sections: z.array(sectionSchema).optional(),

// //   tags: z
// //     .array(z.string().transform((tag) => tag.trim()))
// //     .optional(),

// //   status: z
// //     .enum(['draft', 'published', 'archived'], {
// //       required_error: 'Status is required',
// //     })
// //     .default('draft'),
// // });

// // export type BlogFormSchema = z.infer<typeof blogSchema>;
import z from 'zod';

const imageFileSchema = z.instanceof(File).refine((file) => file.size <= 5 * 1024 * 1024, {
  message: 'Image size must be less than 5MB',
});

export const blogSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .transform((v) => v.trim()),

  overview: z
    .string()
    .min(10, 'Overview must be at least 10 characters')
    .max(250, 'Overview must be below 250 characters')
    .transform((v) => v.trim()),

  content: z
    .string()
    .min(20, 'Content must be at least 20 characters')
    .transform((v) => v.trim()),

  coverImage: z
    .array(imageFileSchema)
    //.refine((file) => file instanceof File, 'Cover image is required').optional(),
    .min(1, 'Image is required')
    ,
   sections: z
    .array(
      z.object({
        heading: z.string().min(3, 'Section title must be at least 3 characters'),
        content: z.string().min(10, 'Section content must be at least 10 characters'),
        image: z.array(imageFileSchema).min(1, ' Image is required'),
      })
    )
    .optional(),

  tags: z.array(z.string().transform((tag) => tag.trim())).optional(),

  status: z.enum(['draft', 'published', 'archived']).default('draft'),
});

export type BlogFormSchema = z.infer<typeof blogSchema>;



// //  Edit Package Schema
// export const EditBlogSchema = blogSchema
//   .extend({
//     coverImage: z.array(z.instanceof(File)).optional(),
//   })


export const EditBlogSchema = blogSchema.extend({
  // optional cover image (user may keep the existing one)
  coverImage: z.array(z.instanceof(File)).optional(),

  // allow _id for existing sections to identify them in backend
  // sections: z
  //   .array(
  //     z.object({
  //       _id: z.string().optional(), // existing section id for updates
  //       heading: z.string().min(3, 'Section title must be at least 3 characters'),
  //       content: z.string().min(10, 'Section content must be at least 10 characters'),
  //       image: z.array(imageFileSchema).min(1, ' Image is required'),
  //     })
  //   )
  //   .optional(),
  sections: z
    .array(
      z.object({
        _id: z.string().optional(),
        heading: z.string().min(3, 'Section title must be at least 3 characters'),
        content: z.string().min(10, 'Section content must be at least 10 characters'),
        image: z
          .array(imageFileSchema)
          .optional()
          .default([])
          .refine(
            (val) => Array.isArray(val),
            'Invalid image input'
          ),
      })
    )
    .optional(),
});
export type EditBlogFormSchema = z.infer<typeof EditBlogSchema>;
