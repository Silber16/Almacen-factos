// backend/config/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

//
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dmwdnfexz', 
  api_key: process.env.CLOUDINARY_API_KEY || '167559538698427',
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'perfiles_usuarios',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],

    transformation: [{ width: 500, height: 500, crop: 'limit' }] 
  },
});

export const upload = multer({ storage: storage });