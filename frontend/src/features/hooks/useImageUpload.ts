import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import imageCompression from 'browser-image-compression';

interface UseImageUploadProps {
  maxImages?: number;
  maxSizeMB?: number; // client-side validation limit
}

export const useImageUpload = ({ maxImages = 4, maxSizeMB = 2 }: UseImageUploadProps = {}) => {
  const [cropQueue, setCropQueue] = useState<File[]>([]);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [croppedImages, setCroppedImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      const acceptedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      const maxSize = maxSizeMB * 1024 * 1024;

      const validFiles = Array.from(files).filter((file) => {
        const isValidType = acceptedTypes.includes(file.type.toLowerCase());
        if (!isValidType) {
          toast.error(`${file.name} has an invalid file type.`);
          return false;
        }
        if (file.size > maxSize) {
          toast.error(`${file.name} is too large. Max allowed size is ${maxSizeMB}MB.`);
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) {
        toast.error('Please select at least 1 valid image.');
        return;
      }

      if (croppedImages.length + validFiles.length > maxImages) {
        toast.error(`You can upload a maximum of ${maxImages} images.`);
        return;
      }

      setCropQueue(validFiles);
      setCurrentImage(URL.createObjectURL(validFiles[0]));
    },
    [croppedImages, maxImages, maxSizeMB]
  );

  // Accept (file, previewUrl) to match ImageCropper
  const handleCropComplete = useCallback(
    async (croppedFile: File, _previewUrl?: string) => {
      const compressedBlob = await imageCompression(croppedFile, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });

      const compressedFile = new File(
        [compressedBlob],
        croppedFile.name || `cropped-${Date.now()}.jpeg`,
        { type: compressedBlob.type || croppedFile.type }
      );

      const updated = [...croppedImages, compressedFile];
      setCroppedImages(updated);

      const nextIndex = croppedImages.length + 1;
      if (nextIndex < cropQueue.length) {
        setCurrentImage(URL.createObjectURL(cropQueue[nextIndex]));
      } else {
        setCurrentImage(null);
        setCropQueue([]);
      }
    },
    [croppedImages, cropQueue]
  );

  const handleCropCancel = useCallback(() => {
    setCurrentImage(null);
    setCropQueue([]);
  }, []);

  const handleRemoveImage = (index: number) => {
    const updated = [...croppedImages];
    updated.splice(index, 1);
    setCroppedImages(updated);
  };

  return {
    croppedImages,
    setCroppedImages, // expose so you can reset after submit
    currentImage,
    fileInputRef,
    handleImageChange,
    handleCropComplete,
    handleCropCancel,
    handleRemoveImage,
  };
};
