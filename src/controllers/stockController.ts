import yahooFinance from "yahoo-finance2";
import prisma from "../config/database.js";
import { sendResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Request, Response } from "express";
import { z } from "zod";

export const getStocks = asyncHandler(async (req: Request, res: Response) => {
  const stocks = await prisma.stock.findMany();
  sendResponse(res, 200, stocks, "Stock data retrieved successfully!", stocks);
});

export const getStockData = asyncHandler(
  async (req: Request, res: Response) => {
    const symbol = z
      .object({
        symbol: z.string().trim(),
      })
      .parse(req.params).symbol;

    const result = await yahooFinance.quoteSummary(`${symbol}.NS`);

    sendResponse(res, 200, result, "Stock data retrieved successfully!");
  }
);

export const getPortfolioData = asyncHandler(
  async (req: Request, res: Response) => {
    const symbol = z
      .object({
        symbol: z.string().trim(),
      })
      .parse(req.params).symbol;

    const results = await yahooFinance.quote(`${symbol}.NS`);

    sendResponse(res, 200, results, "Stock data retrieved successfully!");
  }
);

export const getHistoricalData = asyncHandler(
  async (req: Request, res: Response) => {
    const symbol = z
      .object({
        symbol: z.string().trim(),
      })
      .parse(req.params).symbol;
    const period1 = z
      .object({
        period1: z.string().trim(),
      })
      .parse(req.query).period1;
    const period2 = z
      .object({
        period2: z.string().trim(),
      })
      .parse(req.query).period2;
    
    const result = await yahooFinance.historical(`${symbol}.NS`, {
      period1: period1,
      period2: period2,
    });

    sendResponse(res, 200, result, "Stock data retrieved successfully!");
  }
);
