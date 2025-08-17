import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { PrismaClient } from "@prisma/client";

dotenv.config()
const app = express()
const prisma  = new PrismaClient()

app.use(cors())
app.use(express.json())

app.get("/test-db", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, error: "Database connection failed" });
  }
});


export {app,prisma}
