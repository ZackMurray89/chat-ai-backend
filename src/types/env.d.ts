declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "test" | "production";
    PORT: string;
    STREAM_API_KEY: string;
    STREAM_API_SECRET: string;
    OPENAI_API_KEY: string;
    DATABASE_URL: string;
  }
}
