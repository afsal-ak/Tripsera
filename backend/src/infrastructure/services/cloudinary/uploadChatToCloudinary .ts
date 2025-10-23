import cloudinary from './cloudinary';
import fs from 'fs';

export const uploadChatToCloudinary = async (
  filePath: string,
  folder: string,
  type: 'image' | 'audio' | 'file'
): Promise<{ url: string; public_id: string }> => {
  try {
    console.log(filePath, 'filepath');
    let resourceType: 'image' | 'video' | 'raw' = 'raw';

    if (type == 'image') {
      resourceType = 'image';
    } else if ((type = 'audio')) {
      resourceType = 'video'; // Cloudinary treats audio as video
    } else if ((type = 'file')) {
      resourceType = 'raw';
    }

    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: resourceType,
      ...(type === 'image'
        ? { transformation: [{ width: 1080, height: 1080, crop: 'limit' }] }
        : {}),
    });
     // Delete temp file
    fs.unlink(filePath, (err) => {
      if (err) console.error('Failed to delete local file:', err);
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error('Chat Cloudinary Upload Error:', error);
    throw error;
  }
};

export const deleteChatMediaFromCloudinary = (
  publicId: string,
  resourceType: 'image' | 'video' | 'raw' = 'raw'
): Promise<any> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, { resource_type: resourceType }, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};
