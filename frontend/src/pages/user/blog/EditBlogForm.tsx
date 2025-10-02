
//  export default EditBlogForm
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type EditBlogFormSchema, editBlogSchema } from '@/schemas/editBlogSchema';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/textarea';
import { Label } from '@/components/ui/Label';
import { toast } from 'sonner';
import ImageCropper from '@/components/ImageCropper';
import { handleBlogEdit, fetchBlogById } from '@/services/user/blogService';
import { useImageUpload } from '@/hooks/useImageUpload';

type ExistingImage = {
  url: string;
  public_id: string;
  _id: string;
};

const MAX_IMAGES = 4;

const EditBlogForm = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();

  // existing images coming from DB
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);

  // hook for NEW images (crop/compress/remove)
  const {
    croppedImages, // new images (File[])
    setCroppedImages, // to reset after submit
    currentImage, // image being cropped (string)
    fileInputRef,
    handleImageChange, // original handler from hook
    handleCropComplete,
    handleCropCancel,
    handleRemoveImage,
  } = useImageUpload({ maxImages: MAX_IMAGES, maxSizeMB: 2 });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditBlogFormSchema>({
    resolver: zodResolver(editBlogSchema),
    defaultValues: {
      title: '',
      content: '',
      status: 'draft',
      tags: [],
    },
  });

  // Load existing blog
  useEffect(() => {
    const loadBlog = async () => {
      try {
        const res = await fetchBlogById(blogId!);
        setValue('title', res.title);
        setValue('content', res.content);
        setValue('status', res.status);
        setValue('tags', res.tags || []);
        setExistingImages(res.images || []);
      } catch {
        toast.error('Failed to load blog');
      }
    };
    if (blogId) loadBlog();
  }, [blogId, setValue]);

  // keep RHF synced with ONLY new images (cropped ones)
  useEffect(() => {
    setValue('images', croppedImages, { shouldValidate: true });
  }, [croppedImages, setValue]);

  // wrapper to respect MAX_IMAGES = existing + new
  const onImageChangeWithLimit = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      const remaining = MAX_IMAGES - (existingImages.length + croppedImages.length);
      if (remaining <= 0) {
        toast.error(`You can upload a maximum of ${MAX_IMAGES} images in total.`);
        return;
      }

      // Manually clip the FileList to remaining count (if needed)
      const arr = Array.from(files).slice(0, remaining);
      const dt = new DataTransfer();
      arr.forEach((f) => dt.items.add(f));

      // create a synthetic event using the clipped files
      const syntheticEvent = {
        ...e,
        target: { ...e.target, files: dt.files },
      } as React.ChangeEvent<HTMLInputElement>;

      handleImageChange(syntheticEvent);
    },
    [existingImages.length, croppedImages.length, handleImageChange]
  );

  const onSubmit = async (data: EditBlogFormSchema) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title.trim());
      formData.append('content', data.content.trim());
      formData.append('status', data.status!);
      formData.append('tags', data.tags?.join(',') || '');

      // append NEW images (hook)
      croppedImages.forEach((file) => {
        if (file instanceof File) {
          formData.append('images', file);
        }
      });

      // append remaining EXISTING images (so backend knows which ones stayed)
      existingImages.forEach((img, index) => {
        formData.append(`existingImages[${index}][url]`, img.url);
        formData.append(`existingImages[${index}][public_id]`, img.public_id);
        formData.append(`existingImages[${index}][_id]`, img._id);
      });

      await handleBlogEdit(blogId!, formData);
      toast.success('Blog updated');
      navigate('/account/my-blogs');
      reset();
      setCroppedImages([]);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update blog');
    }
  };

  const handleDeleteExistingImage = (public_id: string) => {
    setExistingImages((prev) => prev.filter((img) => img.public_id !== public_id));
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
            <label>Title</label>
            <Input {...register('title')} />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
          </div>

          <div>
            <label>Content</label>
            <Textarea {...register('content')} rows={5} />
            {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
          </div>

          <div>
            <label>Tags (comma separated)</label>
            <Controller
              control={control}
              name="tags"
              render={({ field }) => (
                <Input
                  placeholder="e.g., travel, beach"
                  onChange={(e) =>
                    field.onChange(e.target.value.split(',').map((tag) => tag.trim()))
                  }
                  value={field.value?.join(', ') || ''}
                />
              )}
            />
            {errors.tags && <p className="text-red-500 text-sm">{errors.tags.message}</p>}
          </div>

          <div>
            <label>Status</label>
            <select {...register('status')} className="p-2 border rounded w-full">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
            {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
          </div>

          <div>
            <Label>Upload Images (Total Max {MAX_IMAGES})</Label>
            <input
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              onChange={onImageChangeWithLimit}
              className="hidden"
            />
            <Button type="button" onClick={() => fileInputRef.current?.click()}>
              Upload Images
            </Button>

            {/* Previews */}
            <div className="grid grid-cols-4 gap-2 mt-2">
              {/* Existing images */}
              {existingImages.map((img) => (
                <div key={img.public_id} className="relative group">
                  <img src={img.url} alt="existing" className="w-full h-24 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => handleDeleteExistingImage(img.public_id)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {/* Newly cropped images */}
              {croppedImages.map((file, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="new"
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
            {isSubmitting ? 'Updating...' : 'Update Blog'}
          </Button>
        </form>
      )}
    </>
  );
};

export default EditBlogForm;
