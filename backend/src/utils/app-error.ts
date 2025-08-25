export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.name = 'AppError'; // Add this line
    this.statusCode = statusCode;
    this.isOperational = true;

    // Capture the stack trace and exclude constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }
}