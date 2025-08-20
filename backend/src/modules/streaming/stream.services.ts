import { PrismaClient } from "@prisma/client";
import crypto from 'crypto'
import { AppError } from "../../utils/error";
import { createStreamSchema, CreateStreamInput } from "./stream.schemas";
import { stream } from "winston";


const prisma = new PrismaClient()

export class StreamService {
    async createStream(userId: string, data: CreateStreamInput) {
        return prisma.stream.create({
            data: {
                title: data.title,
                description: data.description ?? null, // Explicit null conversion
                userId,
                streamKey: crypto.randomBytes(16).toString('hex'),
                rtmpUrl: `rtmp://${process.env.RTMP_SERVER}/live`,
                isLive: false
            },
            include: {
                user: {
                    select: {
                        name: true,
                        avatar: true
                    }
                }
            }
        });
    }


    async startStream(streamKey: string) {
        const stream = await prisma.stream.update({
            where: { streamKey },
            data: { isLive: true, startedAt: new Date() }
        })
        if (!stream) throw new AppError("Inavalid stream key", 404)
        return stream
    }

    async endStream(StreamId : string){
        return prisma.stream.update({
            where : {id : StreamId},
            data : {
                isLive : false,
                endedAt : new Date(),
                viewers : {deleteMany : {}}
            }
        })
    }

    async getLiveStream(){
        return prisma.stream.findMany({
            where : {isLive : true},
            include : {
                user : {select : {name : true,avatar : true}},
                _count : {select : {viewers : true}}
            }
        })
    }

}