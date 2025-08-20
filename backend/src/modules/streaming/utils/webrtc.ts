import {PeerServer} from 'peer'
import { Express } from 'express' 
import {prisma} from '../../../app' 

// Define a type for the PeerServer instance
type PeerServerInstance = ReturnType<typeof PeerServer>;

export const setupPeerServer = (app: Express): PeerServerInstance => {
    const peerServer = PeerServer({
        port: 9000,
        path: '/peerjs',
        proxied: true,
        allow_discovery: true
    })

    peerServer.on('connection', (client: any) => {
        prisma.viewer.create({
            data: {
                streamId: client.token,
                userId: client.metadata?.userId
            }
        }).catch(console.error)
    })

    peerServer.on('disconnect', (client: any) => {
        prisma.viewer.deleteMany({
            where: {
                streamId: client.token,
                userId: client.metadata?.userId
            }
        })
    })

    return peerServer
}