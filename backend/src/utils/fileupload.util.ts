import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = req.query.path as string;

    if (!uploadPath) return cb(new Error('Upload path not specified'), '');

    const fullPath = path.join(__dirname, '../../Uploads', uploadPath);

    // Create the directory if it doesn't exist
    fs.mkdirSync(fullPath, { recursive: true });

    cb(null, fullPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  },
});

export const upload = multer({ storage });