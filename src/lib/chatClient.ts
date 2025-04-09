import { StreamChat } from "stream-chat";

import { env } from "../config/envSchema.js";

const chatClient = StreamChat.getInstance(
  env.STREAM_API_KEY,
  env.STREAM_API_SECRET,
);

export default chatClient;
