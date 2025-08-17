import { app,prisma } from "./app";
import config from "./config"


const PORT = config.port || 8000 

app.listen(PORT,() => {
    console.log(`Server is running on PORT NO ${PORT}`)
})

process.on('SIGTERM',async () => {
    await prisma.$disconnect()
    process.exit()
})