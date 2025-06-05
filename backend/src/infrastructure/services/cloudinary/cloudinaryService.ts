import cloudinary from "./cloudinary";
import fs from 'fs'


export const uploadCloudinary=async (filePath:string):Promise<string>=>{
    try{
    const result=await cloudinary.uploader.upload(filePath,{
        folder:"banners",
        transformation:[
            {
                width:1080,
                height:1080,
                crop:"limit"
            }
        ]
    })
     // ✅ Delete the local file after upload
    fs.unlink(filePath, (err:any) => {
      if (err) console.error('Failed to delete local file:', err);
    });
    return result.secure_url
      } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw error;
  }
}