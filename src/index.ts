import cors from "cors";
import "dotenv/config";
import express, { Application, Request, Response } from "express";
import engagementRoutes from "./route/engagementRoutes.js";
import { connectDB } from "./config/db.js";
const app: Application = express();
const PORT = process.env.PORT || 7000;

// * Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use routes for engagement metrics
app.use('/api', engagementRoutes);
await connectDB();

app.get("/", (req: Request, res: Response) => {
  return res.send("It's working 🙌");
});

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
