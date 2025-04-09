import { Request, Response } from "express";

import { openai } from "../lib/aiClient.js";
import { db } from "../config/database.js";
import { chats, users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { ChatCompletionMessageParam } from "openai/resources";

import chatClient from "../lib/chatClient.js";

export const sendMessage = async (
  req: Request,
  res: Response,
): Promise<any> => {
  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({
      error: "Request Body Invalid or Missing",
    });
  }

  const { message, userId } = req.body;

  if (!message || !userId) {
    return res.status(400).json({
      error: "Message & UserID Are Required",
    });
  }

  try {
    const userResponse = await chatClient.queryUsers({ id: userId });

    if (!userResponse.users.length) {
      return res.status(404).json({
        error: "User Not Found. Please Register or Login First",
      });
    }

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.userId, userId));

    if (!existingUser.length) {
      return res.status(404).json({
        error: "User Not Found In Database",
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    const aiResponse: string =
      response.choices[0].message?.content ?? "No Response From AI";

    await db.insert(chats).values({ userId, message, reply: aiResponse });

    const channel = chatClient.channel("messaging", `chat-${userId}`, {
      name: "AI Chat",
      created_by_id: "ai_bot",
    });

    await channel.create();
    await channel.sendMessage({ text: aiResponse, user_id: "ai_bot" });

    return res.status(200).json({
      reply: aiResponse,
    });
  } catch (error) {
    console.error(`Error in chatController - sendMessage - ${error}`);
    return res.status(400).json({
      error: "Internal Server Error",
    });
  }
};

export const getMessages = async (
  req: Request,
  res: Response,
): Promise<any> => {
  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({
      error: "Request Body Invalid or Missing",
    });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(404).json({
      error: "User Not Found",
    });
  }

  try {
    const chatHistory = await db
      .select()
      .from(chats)
      .where(eq(chats.userId, userId));

    return res.status(200).json({ messages: chatHistory });
  } catch (error) {
    console.error(`Error In chatController - getMessages - ${error}`);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
