import {email, z} from "zod"

export const registerSchema = z.object({
    email : z.string().email(),
    password : z.string().min(8),
    name : z.string().min(2).optional()
})


export const loginSchema = z.object({
    email : z.string().email(),
    password : z.string().min(8)
})  


export const verifyEmailSchema = z.object({
    token : z.string()
})

export const forgotPasswordSchema = z.object({
    email : z.string().email()
})

export const resetPasswordSchema = z.object({
    token: z.string(),
    newPassword : z.string().min(8)
})


export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;