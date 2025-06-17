import type { Area } from 'react-easy-crop';

export const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: Area
): Promise<{ file: File; previewUrl: string }> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Canvas context not available');

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error('Canvas is empty'));
      const file = new File([blob], 'cropped.jpg', { type: 'image/jpeg' });
      const previewUrl = URL.createObjectURL(blob);
      resolve({ file, previewUrl });
    }, 'image/jpeg');
  });
};

const createImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.setAttribute('crossOrigin', 'anonymous');
    image.onload = () => resolve(image);
    image.onerror = (err) => reject(err);
    image.src = url;
  });
};
