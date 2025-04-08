import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register With Stream Chat
app.post(
  "/register-user",
  async (req: Request, res: Response): Promise<any> => {
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({
        error: "Request Body Is Missing Or Invalid",
      });
    }

    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        error: "Name and Email Are Required",
      });
    }

    res.status(200).json({
      message: "Success",
    });
  }
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server Listening On Port: ${PORT}`));
