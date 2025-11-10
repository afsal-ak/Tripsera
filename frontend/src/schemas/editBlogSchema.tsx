// // // import z from 'zod';

// // // export const editBlogSchema = z.object({
// // //   title: z
// // //     .string()
// // //     .min(3)
// // //     .transform((val) => val.trim()),
// // //   content: z
// // //     .string()
// // //     .min(10)
// // //     .transform((val) => val.trim()),
// // //   tags: z.array(z.string().transform((tag) => tag.trim())).optional(),
// // //   status: z.enum(['draft', 'published', 'archived']).optional(),

// // //   existingImages: z
// // //     .array(
// // //       z.object({
// // //         url: z.string(),
// // //         public_id: z.string(),
// // //         _id: z.string(),
// // //       })
// // //     )
// // //     .optional(),
// // //   images: z.array(z.any()).optional(),
// // // });

// // // export type EditBlogFormSchema = z.infer<typeof editBlogSchema>;

// // import z from 'zod';

// // const imageFileSchema = z
// //   .instanceof(File)
// //   .refine((file) => file.size <= 5 * 1024 * 1024, {
// //     message: 'Image size must be less than 5MB',
// //   });

// // export const editBlogSchema = z
// //   .object({
// //     title: z
// //       .string()
// //       .min(3, 'Title must be at least 3 characters')
// //       .transform((v) => v.trim()),

// //     overview: z
// //       .string()
// //       .min(10, 'Overview must be at least 10 characters')
// //       .max(250, 'Overview too long')
// //       .transform((v) => v.trim()),

// //     content: z
// //       .string()
// //       .min(20, 'Content must be at least 20 characters')
// //       .transform((v) => v.trim()),

// //     status: z.enum(['draft', 'published', 'archived']).default('draft'),

// //     tags: z.array(z.string().transform((tag) => tag.trim())).optional(),

// //     // Cover image (can have existing + new)
// //     coverImage: z
// //       .array(imageFileSchema)
// //       .max(1, 'Only one cover image allowed')
// //       .optional()
// //       .default([]),

// //     existingCoverImage: z
// //       .object({
// //         url: z.string(),
// //         public_id: z.string(),
// //         _id: z.string(),
// //       })
// //       .optional(),

// //     // Sections
// //     sections: z
// //       .array(
// //         z.object({
// //           heading: z.string().min(3, 'Section title must be at least 3 characters'),
// //           content: z.string().min(10, 'Section content must be at least 10 characters'),
// //           image: z.any().optional(),
// //           existingImage: z
// //             .object({
// //               url: z.string(),
// //               public_id: z.string(),
// //               _id: z.string(),
// //             })
// //             .optional(),
// //         })
// //       )
// //       .optional(),
// //   })
// //   .refine(
// //     (data) =>
// //       (data.coverImage?.length || 0) <= 1 &&
// //       (!!data.existingCoverImage || (data.coverImage?.length ?? 0) > 0),
// //     {
// //       message: 'A cover image is required (existing or new)',
// //       path: ['coverImage'],
// //     }
// //   );

// // export type EditBlogFormSchema = z.infer<typeof editBlogSchema>;
// import z from 'zod';

// export const sectionSchema = z.object({
//   heading: z.string().min(3, 'Heading is required'),
//   content: z.string().min(10, 'Content must be at least 10 characters'),
//   image: z
//     .object({
//       url: z.string().url(),
//       public_id: z.string().optional(),
//     })
//     .optional(),
// });

// export const editBlogSchema = z.object({
//   title: z.string().min(3, 'Title is required'),
//   overview: z.string().min(10, 'Overview must be at least 10 characters'),
//   content: z.string().min(20, 'Content is required'),
//   tags: z.array(z.string()).optional(),
//   status: z.enum(['draft', 'published', 'archived']).default('draft'),

//   coverImage: z
//     .object({
//       url: z.string().url(),
//       public_id: z.string().optional(),
//     })
//     .optional(),

//   sections: z.array(sectionSchema).optional(),
// });

// export type EditBlogFormSchema = z.infer<typeof editBlogSchema>;
// src/schemas/EditBlogSchema.ts
import z from "zod";

const imageFileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "Image size must be less than 5MB",
  });

export const editBlogSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").transform((v) => v.trim()),
  overview: z
    .string()
    .min(10, "Overview must be at least 10 characters")
    .max(250, "Overview must be at long")
    .transform((v) => v.trim()),
  content: z
    .string()
    .min(20, "Content must be at least 20 characters")
    .transform((v) => v.trim()),

  // Optional cover image (only if changed)
  coverImage: z.array(imageFileSchema).optional(),

  sections: z
    .array(
      z.object({
        heading: z.string().min(3, "Section title must be at least 3 characters"),
        content: z.string().min(10, "Section content must be at least 10 characters"),
        image: z.any().optional(),
        existingImage: z.any().optional(),
      })
    )
    .optional(),

  tags: z.array(z.string().transform((tag) => tag.trim())).optional(),

  status: z.enum(["draft", "published", "archived"]).default("draft"),

  // For tracking existing Cloudinary images
  existingImages: z.any().optional(),
});

export type EditBlogFormSchema = z.infer<typeof editBlogSchema>;
