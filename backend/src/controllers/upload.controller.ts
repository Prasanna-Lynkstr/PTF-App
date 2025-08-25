import { Request, Response } from 'express';
import path from 'path';

export const uploadFile = (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const relativePath = req.query.path as string;
    const filename = req.file.filename;
    const fileUrl = `/Uploads/${relativePath}/${filename}`;

    return res.json({ url: fileUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Upload failed' });
  }
};

import fs from 'fs';
import { promisify } from 'util';

const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);

export const uploadOrgImageFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const prefix = (req.query.prefix as string) || 'logo'; // 'logo' or 'cover'
    const orgId = req.body.orgId || 'default-org';
    const timestamp = Date.now();
    const ext = path.extname(req.file.originalname);
    const filename = `${orgId}-${prefix}-${timestamp}${ext}`;
    const folderPath = path.join(__dirname, '../../public/server-images', prefix);

    await mkdirAsync(folderPath, { recursive: true });

    const fullPath = path.join(folderPath, filename);
    await writeFileAsync(fullPath, req.file.buffer);

    const fileUrl = `/${prefix}/${filename}`;
    
    return res.json({ url: fileUrl });
  } catch (error) {
    console.error('Org Image Upload Error:', error);
    return res.status(500).json({ error: 'Org image upload failed' });
  }
};