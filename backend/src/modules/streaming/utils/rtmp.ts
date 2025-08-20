import NodeMediaServer from "node-media-server"
import { StreamService } from '../stream.services'


const streamService = new StreamService()

export const setupRmtpServer = () => {
    const nms = new NodeMediaServer({
        rtmp: {
            port: 1935,
            chunk_size: 60000,
            gop_cache: true,
            ping: 60,
            ping_timeout: 30,
        },
        http: {
            port: 8000,
            allow_origin: "*",
            mediaroot: "./media", // ✅ required
        },
        trans: {
            ffmpeg: "/usr/bin/ffmpeg", // path to ffmpeg (adjust if needed)
            tasks: [
                {
                    app: "live",
                    mp4: true,
                    mp4Flags: "[movflags=frag_keyframe+empty_moov]",
                },
            ],
        },
    })

    nms.on('prePublish', async (id: string, streamPath: string, args: any) => {
        const streamKey = streamPath.split("/").pop()
        try {
            await streamService.startStream(streamKey!)
            console.log(`Streamed Started : ${streamKey}`)
        } catch (error) {
            console.error('Stream auth failed', error)
            // @ts-ignore
            nms.getSession(id).reject();
        }
    })

    nms.on('donePublish', (id: string, streamPath: string) => {
        const streamKey = streamPath.split('/').pop()
        streamService.endStream(streamKey!).catch(console.error)
    })

    return nms
}