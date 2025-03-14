import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create upload directories if they don't exist
const createDirs = () => {
  const dirs = ['uploads', 'uploads/banners', 'uploads/speakers', 'uploads/resources'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createDirs();

// Configure storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    let uploadPath = 'uploads/';
    
    if (file.fieldname === 'bannerImage') {
      uploadPath += 'banners/';
    } else if (file.fieldname === 'speakerImages') {
      uploadPath += 'speakers/';
    } else if (file.fieldname === 'resources') {
      uploadPath += 'resources/';
    }
    
    cb(null, uploadPath);
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
  }
});

// Create the multer instance
export const uploadFiles = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max file size
}).fields([
  { name: 'bannerImage', maxCount: 1 },
  { name: 'speakerImages', maxCount: 10 },
  { name: 'resources', maxCount: 10 }
]);