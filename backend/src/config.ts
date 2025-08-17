import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

             // ensure final type is number

  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default("1d"),
  CORS_ORIGIN: z.string().default("*"),
});

type Env = z.infer<typeof envSchema>;


const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error(
    "❌ Invalid environment variables:",
    env.error.flatten().fieldErrors
  );
  throw new Error("Invalid environment variables");
}

export default {
  env: env.data.NODE_ENV,
  port: process.env.PORT, // Now properly typed as number
  jwt: {
    secret: env.data.JWT_SECRET,
    expiresIn: env.data.JWT_EXPIRES_IN,
  },
  database: {
    url: env.data.DATABASE_URL,
  },
  cors: {
    origin: env.data.CORS_ORIGIN,
  },
} as const;