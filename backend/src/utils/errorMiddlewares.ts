import { NextFunction, Request, Response } from "express";
import { AppError } from "./error";
import logger from "./logger";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log operational errors (AppError)
  if (err instanceof AppError && err.isOperational) {
    logger.warn(`[Operational Error] ${err.message}`);
  } 
  // Log programming errors (unexpected)
  else {
    logger.error(`[Critical Error] ${err.stack || err.message}`);
  }

  // Handle AppError (known errors)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  // Handle Zod validation errors (if using Zod)

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      error: "Invalid token",
    });
  }

  // Generic 500 error for unexpected issues
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
};