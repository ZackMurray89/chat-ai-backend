import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"], {
    required_error: "NODE_ENV Is A Required Value",
    invalid_type_error:
      "NODE_ENV Must Either Be 'production', 'test', 'development'",
  }),
  PORT: z.string().optional().default("5000"),
  STREAM_API_KEY: z.string().min(1, "Stream API Key Is Required"),
  STREAM_API_SECRET: z.string().min(1, "Stream API Secret Is Required"),
  OPENAI_API_KEY: z.string().min(1, "OpenAI API Key Is Required"),
  DATABASE_URL: z.string().url("Database URL Must Be A Valid URL"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error(`❌ Invalid ENV Variables: `);
  console.error(_env.error.flatten());
  process.exit(1);
}

export const env = _env.data;
