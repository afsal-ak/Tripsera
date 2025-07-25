import cloudinary from './cloudinary';
import fs from 'fs';

export const uploadCloudinary = async (
  filePath: string,
  folder: string
): Promise<{ url: string; public_id: string }> => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      transformation: [{ width: 1080, height: 1080, crop: 'limit' }],
    });

    fs.unlink(filePath, (err: any) => {
      if (err) console.error('Failed to delete local file:', err);
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw error;
  }
};

export const deleteImageFromCloudinary = (publicId: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};
