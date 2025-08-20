import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { StreamService } from "./stream.services";
import { createStreamSchema } from "./stream.schemas";
import { AppError } from "../../utils/error"; // Import error class

const streamService = new StreamService();

export const createStream = asyncHandler(async (req: Request, res: Response) => {
  // 1. Validate request body
  const validation = createStreamSchema.safeParse(req.body);
  
  if (!validation.success) {
    throw new AppError("Invalid stream data", 400);
  }

  // 2. Check if user exists (req.user should be set by auth middleware)
  if (!req.user) {
    throw new AppError("Authentication required", 401);
  }

  // 3. Create stream with validated data
  const stream = await streamService.createStream(req.user.id, validation.data);
  res.status(201).json(stream);
});

export const getLiveStreams = asyncHandler(async (req: Request, res: Response) => {
  const streams = await streamService.getLiveStream(); // Fixed method name
  res.json(streams);
});

export const endStream = asyncHandler(async (req: Request, res: Response) => {
  // 1. Check authentication
  if (!req.user) {
    throw new AppError("Authentication required", 401);
  }

  // 2. Validate stream ID
  const streamId = req.params.id;
  if (!streamId) {
    throw new AppError("Stream ID is required", 400);
  }

  // 3. End stream (service should verify user owns the stream)
  await streamService.endStream(streamId);
  res.json({ success: true });
});