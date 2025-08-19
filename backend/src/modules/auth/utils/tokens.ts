import jwt from "jsonwebtoken"
import config from "../../../config"
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient()

interface JwtPayload {
  userId: string;
}

// Generate JWT with proper typing
export const generateToken = (userId: string): string => {
  return jwt.sign(
    { userId } as JwtPayload,
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn } as jwt.SignOptions
  );
};


export const generateVerifyToken = async (user: User): Promise<string> => {
  const token = jwt.sign({ userId: user.id }, config.jwt.secret, {
    expiresIn: "1h",
  });

  await prisma.user.update({
    where: { id: user.id },
    data: {
      verifyToken: token,
      verifyTokenExpiry: new Date(Date.now() + 3600000), // 1 hour
    },
  });

  return token;
};


export const generateResetToken = async (user: User): Promise<string> => {
  const token = jwt.sign({ userId: user.id }, config.jwt.secret, {
    expiresIn: "1h",
  });

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken: token,
      resetTokenExpiry: new Date(Date.now() + 3600000), // 1 hour
    },
  });

  return token;
};


