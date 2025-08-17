import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import {prisma} from "../../app"

class AuthService {
    async login (email : string , password : string) {
        const user = await prisma.user.findFirst()
    }
}