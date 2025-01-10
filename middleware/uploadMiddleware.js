import multer from 'multer';
import path from 'path';

// Set up storage for multer (you can customize this as per your needs)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files to the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Set the filename to current timestamp
  },
});

// Multer upload configuration
const upload = multer({ storage: storage });

// Middleware to handle single file upload
const uploadSingle = (fieldName) => {
  return upload.single(fieldName);
};

export { uploadSingle };
