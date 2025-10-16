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

  // keep RHF images in sync with hook state
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
      setCroppedImages([]); // reset hook state
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
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-4">
            <h2 className="text-lg font-semibold mb-4">Crop Image</h2>
            <ImageCropper
              image={currentImage}
              onCropComplete={handleCropComplete}
              onCancel={handleCropCancel}
            />
          </div>
        </div>
      )}

      {!currentImage && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl mx-auto">
          <div>
            <Label>Title</Label>
            <Input {...register('title')} />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
          </div>

          <div>
            <Label>Content</Label>
            <Textarea {...register('content')} rows={5} />
            {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
          </div>

          <div>
            <Label>Tags (comma separated)</Label>
            <Controller
              control={control}
              name="tags"
              render={({ field }) => (
                <Input
                  placeholder="e.g., travel, beach"
                  onChange={(e) =>
                    field.onChange(e.target.value.split(',').map((tag) => tag.trim()))
                  }
                  value={field.value!.join(', ')}
                />
              )}
            />
            {errors.tags && <p className="text-red-500 text-sm">{errors.tags.message}</p>}
          </div>

          <div>
            <Label>Status</Label>
            <select {...register('status')} className="p-2 border rounded w-full">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
            {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
          </div>

          <div>
            <Label>Upload Images (Max 4)</Label>
            <br />
            <input
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
            <Button type="button" onClick={() => fileInputRef.current?.click()}>
              Upload Images
            </Button>

            {errors.images && <p className="text-red-500 text-sm">{errors.images.message}</p>}

            <div className="grid grid-cols-4 gap-2 mt-2">
              {croppedImages.map((file, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-full h-24 object-cover rounded"
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
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Create Blog'}
          </Button>
        </form>
      )}
    </>
  );
};

export default AddBlogForm;
