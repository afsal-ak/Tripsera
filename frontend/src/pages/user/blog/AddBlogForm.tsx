import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { blogSchema, type BlogFormSchema } from '@/schemas/BlogSchema';
import { useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/textarea';
import { Label } from '@/components/ui/Label';
import { toast } from 'sonner';
import ImageCropper from '@/components/ImageCropper';
import { handleBlogCreation } from '@/services/user/blogService';
import { useNavigate } from 'react-router-dom';
import { useImageUpload } from '@/hooks/useImageUpload';
import { ImagePlus } from 'lucide-react';

const AddBlogForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    croppedImages,
    setCroppedImages,
    currentImage,
    fileInputRef,
    handleImageChange,
    handleCropComplete,
    handleCropCancel,
    handleRemoveImage,
  } = useImageUpload({ maxImages: 4, maxSizeMB: 2 });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BlogFormSchema>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: '',
      content: '',
      tags: [],
      images: [],
      status: 'draft',
    },
  });

  useEffect(() => {
    setValue('images', croppedImages, { shouldValidate: true });
  }, [croppedImages, setValue]);

  const onSubmit = async (data: BlogFormSchema) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('title', data.title.trim());
      formData.append('content', data.content.trim());
      formData.append('status', data.status!);
      data.tags!.forEach((tag) => formData.append('tags', tag.trim()));
      croppedImages.forEach((file) => formData.append('images', file));

      await handleBlogCreation(formData);
      toast.success('Blog created successfully!');
      navigate('/account/my-blogs');
      reset();
      setCroppedImages([]);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {currentImage && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Crop Image</h2>
            <ImageCropper
              image={currentImage}
              onCropComplete={handleCropComplete}
              onCancel={handleCropCancel}
            />
          </div>
        </div>
      )}

      {!currentImage && (
        <section className="min-h-screen flex justify-center items-center bg-gray-50 py-10">
          <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl border border-gray-100">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              ✍️ Create a New Blog
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Title */}
              <div>
                <Label>Title</Label>
                <Input
                  {...register('title')}
                  placeholder="Enter blog title"
                  className="mt-1"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              {/* Content */}
              <div>
                <Label>Content</Label>
                <Textarea
                  {...register('content')}
                  rows={6}
                  placeholder="Write your blog content..."
                  className="mt-1"
                />
                {errors.content && (
                  <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
                )}
              </div>

              {/* Tags */}
              <div>
                <Label>Tags (comma separated)</Label>
                <Controller
                  control={control}
                  name="tags"
                  render={({ field }) => (
                    <Input
                      placeholder="e.g. travel, adventure, mountains"
                      onChange={(e) =>
                        field.onChange(
                          e.target.value.split(',').map((tag) => tag.trim())
                        )
                      }
                      value={field.value!.join(', ')}
                      className="mt-1"
                    />
                  )}
                />
                {errors.tags && (
                  <p className="text-red-500 text-sm mt-1">{errors.tags.message}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <Label>Status</Label>
                <select
                  {...register('status')}
                  className="p-2 border rounded-lg w-full mt-1 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
                {errors.status && (
                  <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
                )}
              </div>

              {/* Image Upload */}
              <div>
                <Label>Upload Images (Max 4)</Label>
                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 bg-black hover:bg-black text-white"
                  >
                    <ImagePlus size={18} />
                    Upload Images
                  </Button>
                </div>

                {errors.images && (
                  <p className="text-red-500 text-sm mt-1">{errors.images.message}</p>
                )}

                {/* Preview */}
                {croppedImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                    {croppedImages.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt="preview"
                          className="w-full h-28 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r bg-black  text-white font-medium rounded-lg transition"
                >
                  {isSubmitting ? 'Submitting...' : 'Create Blog'}
                </Button>
              </div>
            </form>
          </div>
        </section>
      )}
    </>
  );
};

export default AddBlogForm;
