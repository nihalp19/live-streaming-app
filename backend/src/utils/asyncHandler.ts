import { NextFunction, Request, Response, RequestHandler } from "express";
import { AppError } from "./error";

// Type for async route handlers
type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

// Wrapper to avoid try/catch blocks in controllers
export const asyncHandler = (fn: AsyncRequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

// Alternative version with error logging
export const asyncHandlerWithLogging = (fn: AsyncRequestHandler): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.error(`[AsyncHandler Error]`, error);
      next(error);
    }
  };
};