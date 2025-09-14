import multer from "multer";
import path from "path";
import fs from 'fs'

const storage = multer.diskStorage({
    destination: (_, __, cb) => cb(null, 'uploads/'),
    filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
})

export const chatUpload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_, file, cb) => {
        const ext = path.extname(file.originalname).toLocaleLowerCase();

        const allowedExts = [
            // images
            ".jpg", ".jpeg", ".png", ".webp",
            // audio
            ".mp3", ".wav", ".m4a",
            // docs/files
            ".pdf", ".docx", ".xlsx", ".zip"
        ]
          if (!allowedExts.includes(ext)) {
      return cb(new Error("Invalid file type for chat message") as any, false);
    }
    cb(null, true);
    }
})

