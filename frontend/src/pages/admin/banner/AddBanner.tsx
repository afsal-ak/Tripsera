import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '@/lib/utils/cropUtils';
import { Label } from '@/component/ui/label';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/Button';
import { addBanner } from '@/services/admin/bannerService';
import { toast } from 'sonner';
import Modal from '@/components/ui/Model';
const AddBannerForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Only JPG, PNG, or WEBP images are allowed.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropConfirm = async () => {
    if (!imagePreview || !croppedAreaPixels) return;

    const result = await getCroppedImg(imagePreview, croppedAreaPixels);
    if (result) {
      const { file, previewUrl } = result;
      setImageFile(file);
      // optionally use previewUrl if needed
      setShowCropper(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return; // prevent double submit

    // Trim inputs
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    // Basic validation
    if (!trimmedTitle || !trimmedDescription || !imageFile) {
      toast.error('Please fill all fields and upload an image.');
      return;
    }

    setIsSubmitting(true); // disable button immediately

    const formData = new FormData();
    formData.append('title', trimmedTitle);
    formData.append('description', trimmedDescription);
    formData.append('image', imageFile);

    try {
      await addBanner(formData);
      toast.success('Banner added successfully!');

      // Clear fields
      setTitle('');
      setDescription('');
      setImageFile(null);
      setImagePreview('');
      setIsSubmitting(false); // allow button to work again

      // Navigate AFTER all is done
      navigate('/admin/banners');
    } catch (error) {
      setIsSubmitting(false); // re-enable button if failed
      toast.error('Failed to add banner.');
      console.error('Banner creation error:', error);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4">Add New Banner</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="image">Banner Image</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => {
              handleImageChange(e);
            }}
            required
          />
        </div>

        {imageFile && (
          <img
            src={URL.createObjectURL(imageFile)}
            alt="Preview"
            className="mt-3 rounded-md w-full max-h-64 object-cover border"
          />
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </form>

      {/* Crop Modal */}
      {showCropper && (
        <Modal onClose={() => setShowCropper(false)}>
          <div className="relative w-[300px] h-[300px]">
            <Cropper
              image={imagePreview}
              crop={crop}
              zoom={zoom}
              aspect={16 / 9}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setShowCropper(false)}>
              Cancel
            </Button>
            <Button onClick={handleCropConfirm}>Crop</Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AddBannerForm;
