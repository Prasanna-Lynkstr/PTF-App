import express, { Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import app from './src/app';

dotenv.config();

const server = express();
server.set('trust proxy', true);

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? 'https://yourdomain.com' : '*',
};
server.use(cors(corsOptions));

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Serve logo images
server.use('/logo', express.static(path.join(__dirname, 'public', 'server-images', 'logo')));
server.use('/cover', express.static(path.join(__dirname, 'public', 'server-images', 'cover')));

// API routes
server.use('/api', app);

// Serve frontend static files
const frontendPath = path.join(__dirname, '..', 'dist');
server.use(express.static(frontendPath));

// Catch-all handler for frontend routing using regex, excluding /api routes
server.get(/^\/(?!api|logo|cover).*/, (req: Request, res: Response) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
