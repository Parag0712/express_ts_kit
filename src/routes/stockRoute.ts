import express from "express";
import {
    getHistoricalData,
    getPortfolioData,
    getStockData,
    getStocks,
} from "../controllers/stockController.js";

const router = express.Router();

router.get("/", getStocks);
router.get("/portfolio/:symbol", getPortfolioData);
router.get("/stock-data/:symbol", getStockData);
router.get("/historical-data/:symbol", getHistoricalData);

export default router;
