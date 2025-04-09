import express, { Application } from "express";
import cors from "cors";

import { env } from "./config/envSchema.js";
import { API_BASE_ROUTE } from "./constants/apiConstants.js";

import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(`${API_BASE_ROUTE}/users`, userRouter);
app.use(`${API_BASE_ROUTE}/chat`, chatRouter);

const PORT = env.PORT;

app.listen(PORT, () => console.log(`Server Listening On Port: ${PORT}`));
