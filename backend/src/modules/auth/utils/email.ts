import { User } from "@prisma/client";

// Mock email sender (replace with Nodemailer/SendGrid in production)
export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `https://yourapp.com/verify-email?token=${token}`;
  console.log(`Sending verification email to ${email}: ${verificationUrl}`);
  // Actual implementation would use Nodemailer/SendGrid
};

export const sendResetEmail = async (email: string, token: string) => {
  const resetUrl = `https://yourapp.com/reset-password?token=${token}`;
  console.log(`Sending reset email to ${email}: ${resetUrl}`);
  // Actual implementation would use Nodemailer/SendGrid
};