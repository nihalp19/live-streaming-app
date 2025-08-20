import {Server} from "socket.io"
import {prisma} from "../../.././app"
import { timeStamp } from "console"

export const registerStreamEvents = (io : Server) => {
    io.on('connection',(socket) => {
        socket.on('join_stream',async(streamId : string) => {
            socket.join(streamId)

            const viewers = await io.in(streamId).allSockets()
            io.to(streamId).emit('viewer_count',viewers.size)

            socket.to(streamId).emit('viewer_joined',{
                userId : socket.data.user?.id,
                username : socket.data.user?.username 
            })

            socket.on('stream_chat',(data) => {
                io.to(data.streamId).emit('new_message',{
                    user : socket.data.user,
                    message : data.message,
                    timeStamp : new Date()
                })
            })
        })
    })
}