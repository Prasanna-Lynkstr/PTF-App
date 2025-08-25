import express from 'express';
import multer from 'multer';
import { uploadFile } from '../controllers/upload.controller';
import { uploadOrgImageFile } from '../controllers/upload.controller';

const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage });

const router = express.Router();

// Route: /api/upload?path=hiring-org/verification-docs
router.post('/', upload.single('file'), uploadFile);

// Route: /api/upload-org-image?path=hiring-org/logo&prefix=logo
router.post('/org-image', upload.single('file'), (req, res, next) => {
    const prefix = req.query.prefix as string || 'default';
    req.body.prefix = prefix;
    uploadOrgImageFile(req, res);
});


export default router;