import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { PrismaClient, User, Role } from "@prisma/client";
import { RegisterInput, LoginInput, VerifyEmailInput, ForgotPasswordInput, ResetPasswordInput } from "./auth.schema";
import { prisma } from "../../app";
import { error } from "console";
import { AppError } from "../../utils/error";
import { generateResetToken, generateToken, generateVerifyToken } from "./utils/tokens";
import { sendVerificationEmail,sendResetEmail } from "./utils/email";



const SALT_ROUNDS = 12

export class AuthService {
    async register(data: RegisterInput): Promise<{ user: User, token: string }> {
        const { email, password, name } = data

        const exitingUser = await prisma.user.findUnique({ where: { email } })

        if (exitingUser) throw new AppError("Email already in Use", 409)

        const hashPassword = await bcrypt.hash(password, SALT_ROUNDS)

        const user = await prisma.user.create({
            data: {
                email,
                password: hashPassword,
                name: name ?? null, // convert undefined → null
                role: Role.USER
            }
        })

        const verifyToken = await generateVerifyToken(user)
        await sendVerificationEmail(user.email, verifyToken)

        const token = generateToken(user.id)

        return { user, token }
    }

    async login (data : LoginInput) : Promise<{user : User,token : string}>{
        const {email,password} = data 

        const user = await prisma.user.findUnique({where : {email}})
        if(!user) throw new AppError("Invalid credentails",401)

       const isValid = await bcrypt.compare(password,user.password)
       if(!isValid) throw new AppError("Invalid credentails",401) 

        await prisma.user.update({
            where : {id : user.id},
            data : {lastLogin : new Date()}
        })    

        const token = generateToken(user.id)
        return {user,token}
    }

    async verifyEmail (token:string) : Promise<User>{
        const user = await prisma.user.findFirst({
            where : {verifyToken : token,verifyTokenExpiry : {gt : new Date()} }
        })

        if(!user)
        {
            throw new AppError("Invalid or expired token",400)
        }    

        return await prisma.user.update({
            where : {id : user.id},
            data : {
                isVerified : true,
                verifyToken : null,
                verifyTokenExpiry : null
            }
        })
    }


    async forgetPassword (email : string) : Promise<void> {
        const user = await prisma.user.findUnique({where : {email}})

        if(!user) return ;
        const resetToken = await generateResetToken(user)
        await sendResetEmail(user.email,resetToken)
    }


    async resetPassword (token : string,newPassword : string) : Promise<User> {
        const user = await prisma.user.findFirst({
            where : {resetToken : token,resetTokenExpiry : {gt : new Date()}} 
        })


        if(!user) throw new AppError("Invalid or expired token",400)
        const hashPassword = await bcrypt.hash(newPassword,SALT_ROUNDS)
    
        return await prisma.user.update({
            where : {id : user.id},
            data : {
                password : hashPassword,
                resetToken : null,
                resetTokenExpiry : null,
            }
        })

    }

}