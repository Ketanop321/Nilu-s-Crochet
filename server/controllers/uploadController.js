import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  console.log('Creating upload directory:', uploadDir);
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Saving file to directory:', uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const filename = `image-${uniqueSuffix}${ext}`;
    console.log('Generated filename:', filename);
    cb(null, filename);
  },
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  console.log('Received file:', file);
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    console.error('Invalid file type:', file.mimetype);
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Initialize multer upload
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Upload middleware
const uploadFile = upload.single('image');

// Handle file upload
const handleUpload = (req, res) => {
  console.log('Upload request received');
  
  uploadFile(req, res, async (err) => {
    if (err) {
      console.error('Upload error:', err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File size too large. Maximum size is 5MB.',
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message || 'Error uploading file',
      });
    }

    if (!req.file) {
      console.error('No file received in request');
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    console.log('File uploaded successfully:', req.file);
    
    // Return the file URL
    const fileUrl = `/uploads/${req.file.filename}`;
    
    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      imageUrl: fileUrl,
    });
  });
};

export { handleUpload };
