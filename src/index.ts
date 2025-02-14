import express, { Application, Request, Response } from "express";
import "dotenv/config";
import cors from "cors";

const app: Application = express();
const PORT = process.env.PORT || 7000;
import path from "path";
import { fileURLToPath } from "url";
import csvRoutes from "./routes/csvRoute.js";
import stockRoutes from "./routes/stockRoute.js";

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

// * Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/csv', csvRoutes);
app.use('/api/stock', stockRoutes);

app.get("/", (req: Request, res: Response) => {
  return res.send("It's working 🙌");
});

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
