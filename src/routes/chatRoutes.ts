import express, { Router } from "express";
import { getMessages, sendMessage } from "../controllers/chatController.js";

const router: Router = express.Router();

router.post("/send", sendMessage);
router.post("/get-messages", getMessages);

export default router;
