import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken"
import { PrismaClient, Role } from "@prisma/client";
import config from "../../config";
import { AppError } from "../../utils/error";


const prisma = new PrismaClient()


export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) throw new AppError("Authentication required", 401)

    try {
        const payload = jwt.verify(token, config.jwt.secret) as { userId: string }

        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isVerified: true,
            }
        })

        if (!user) throw new AppError("user not found", 404)
        req.user = user;
        next()
    } catch (err) {
        throw new AppError("Invalid Token",401)
    }

}


export const requireRole = (role : Role) => {
    return (req : Request,res : Response,next : NextFunction) => {
        if(req.user?.role !== role){
            throw new AppError("Unauthorized",403)
        }
        next()
    };
}