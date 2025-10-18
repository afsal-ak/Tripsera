import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';
import { getCroppedImg } from '@/lib/utils/cropUtils';
import { Button } from '@/components/Button';
import imageCompression from 'browser-image-compression';

interface Props {
  image: string;
  onCropComplete: (croppedFile: File, previewUrl: string) => void;
  aspect?: number;
  onCancel: () => void;
}

const ImageCropper: React.FC<Props> = ({ image, onCropComplete, onCancel, aspect }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropCompleteCallback = useCallback((_croppedArea: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleDone = async () => {
    try {
      if (!croppedAreaPixels) return;
      const { file, previewUrl } = await getCroppedImg(image, croppedAreaPixels);

      const compressedBlob = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });

      const compressedFile = new File([compressedBlob], file.name || 'cropped.jpg', {
        type: compressedBlob.type,
      });

      onCropComplete(compressedFile, previewUrl);
    } catch (e) {
      console.error('Crop failed:', e);
    }
  };

  return (
    <div className="relative w-full h-[400px] bg-black rounded-md overflow-hidden">
      <Cropper
        image={image}
        crop={crop}
        zoom={zoom}
        aspect={aspect || 1}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropCompleteCallback}
      />
      <div className="absolute bottom-16 left-0 right-0 flex justify-center">
        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-1/2"
        />
      </div>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleDone}>Crop</Button>
      </div>
    </div>
  );
};

export default ImageCropper;
