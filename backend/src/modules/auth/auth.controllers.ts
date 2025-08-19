import { registerSchema,loginSchema,verifyEmailSchema,forgotPasswordSchema,resetPasswordSchema } from "./auth.schema";
import { AuthService } from "./auth.services";
import { asyncHandler } from "../../utils/asyncHandler";
import { Request,Response } from "express";


const authService = new AuthService()

export const register = asyncHandler(async(req: Request,res : Response) => {
    const data =  registerSchema.parse(req.body)
    const {user,token} = await authService.register(data)
    res.status(201).json({user,token})
})  

export const login = asyncHandler(async(req : Request,res : Response) => {
    const data = loginSchema.parse(req.body)
    const {user,token} = await authService.login(data)
    res.json({user,token})
})


export const verifyEmail = asyncHandler(async(req: Request,res : Response) => {
    const {token} = verifyEmailSchema.parse(req.body)
    const user = await authService.verifyEmail(token)
    res.json({user})
})

export const forgetPassword = asyncHandler(async(req: Request,res : Response) => {
    const {email} = forgotPasswordSchema.parse(req.body)
    const user = await authService.forgetPassword(email)
    res.json({user})
})

export const resetPassword = asyncHandler(async(req:Request,res :Response) => {
    const {token,newPassword} = resetPasswordSchema.parse(req.body)
    const user = await authService.resetPassword(token,newPassword)
    res.json({user})
})


