import { Request, Response } from "express";

import { db } from "../config/database.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { ChatCompletionMessageParam } from "openai/resources";

import chatClient from "../lib/chatClient.js";

export const register = async (req: Request, res: Response): Promise<any> => {
  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({
      error: "Request Body Missing Or Invalid",
    });
  }

  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      error: "Name & Email Are Required",
    });
  }

  try {
    const userId = email.replace(/[^a-zA-Z0-9_-]/g, "_");

    // Check If User Alreadys Exists
    const userResponse = await chatClient.queryUsers({ id: { $eq: userId } });

    if (!userResponse.users.length) {
      await chatClient.upsertUser({
        id: userId,
        name: name,
        email: email,
        role: "user",
      });
    }

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.userId, userId));

    if (!existingUser.length) {
      console.log(`User ${userId} Does Not Exist In Database. Creating Now...`);
      await db.insert(users).values({ userId, name, email });
    }

    return res.status(200).json({ userId, name, email });
  } catch (error) {
    console.error(`Error In userController - register - ${error}`);
    return res.status(400).json({
      error: "Internal Server Error",
    });
  }
};
