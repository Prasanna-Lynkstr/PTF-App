// src/app.ts - TypeScript API setup

import express, { Application, Request, Response, Router } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import analyzeRoute from './routes/analyze.route.ts';
import emailRoute from './routes/email.route.ts';
import adminRoute from './routes/admin.route.ts';
import orgRoutes from './routes/org.route.ts';
import uploadRoutes from './routes/upload.route.ts';
import authRoutes from './routes/auth.route.ts';
import userRoutes from "./routes/user.route.ts";

const app: Application = express();

app.use((req, res, next) => {
  next();
});

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5000',
  credentials: true
}));
app.use(express.json()); // Middleware to parse JSON
app.use(cookieParser());

app.use('/server-images', express.static(path.join(__dirname, '..', 'public', 'server-images')));

const logoDir = path.join(__dirname, '..', 'public', 'server-images/logo');
app.use('/logo', (req, res, next) => {
  next();
});
app.use('/logo', express.static(logoDir, {
  fallthrough: false
}));

const logoTestPath = path.join(__dirname, '..', 'public', 'server-images/logo');
app.use('/logo-test', express.static(logoTestPath));

const coverDir = path.join(__dirname, '..', 'public', 'server-images/cover');
app.use('/cover', (req, res, next) => {
  next();
});
app.use('/cover', express.static(coverDir, {
  fallthrough: false
}));
app.use('/analyze', analyzeRoute as Router); // Mount analyze route with proper type
app.use('/email', emailRoute as Router);
app.use('/admin', adminRoute as Router);
app.use('/org', orgRoutes as Router);
app.use('/upload', uploadRoutes as Router);
app.use('/auth', authRoutes as Router);
app.use("/user", userRoutes as Router)

if ((emailRoute as any).stack) {
  (emailRoute as any).stack.forEach((layer: any) => {
    if (layer.route) {
      const methods = Object.keys(layer.route.methods).map(m => m.toUpperCase()).join(', ');
      console.log(`[EMAIL ROUTE] ${methods} /api/email${layer.route.path}`);
    }
  });
}

// Health check
app.get('/', (req: Request, res: Response) => {
  res.send('API is working');
});

app.get('/ping', (req, res) => {
  res.send('pong');
});

function logAllRoutes(app: Application) {
  if (app._router && app._router.stack) {
    app._router.stack.forEach((middleware: any) => {
      if (middleware.route) {
        const methods = Object.keys(middleware.route.methods).map(m => m.toUpperCase()).join(', ');
        console.log(`[ROUTE] ${methods} ${middleware.route.path}`);
      } else if (middleware.name === 'router' && middleware.handle.stack) {
        middleware.handle.stack.forEach((handler: any) => {
          if (handler.route) {
            const methods = Object.keys(handler.route.methods).map(m => m.toUpperCase()).join(', ');
            console.log(`[ROUTE] ${methods} ${handler.route.path}`);
          }
        });
      }
    });
  }
}

logAllRoutes(app);

// Global error handler
app.use((err: any, req: Request, res: Response, next: Function) => {
  if (err.name === 'AppError' || err.statusCode) {
    res.status(err.statusCode || 400).json({ message: err.message });
  } else {
    console.error('Unexpected error:', err);
    res.status(500).json({ message: 'Something went wrong. Please try again later.' });
  }
});

// Prevent frontend fallback for image routes
app.use((req, res, next) => {
  if (req.url.startsWith('/logo') || req.url.startsWith('/cover') || req.url.startsWith('/server-images')) {
    return next();
  }
  next();
});

export default app;