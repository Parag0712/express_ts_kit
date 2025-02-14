import axios from "axios";
import csvParser from "csv-parser";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { sendResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Readable } from "stream";

const prisma = new PrismaClient();
const CSV_URL = "https://nsearchives.nseindia.com/content/equities/EQUITY_L.csv";

export const downloadAndStoreCSV = asyncHandler(async (req: Request, res: Response) => {
  console.log("Fetching CSV from NSE...");

  try {
    const response = await axios.get(CSV_URL, {
      responseType: "stream",
      timeout: 30000, // 30 seconds timeout
      headers: {
        "User-Agent": "Mozilla/5.0", // Prevent server blocking
        Accept: "text/csv",
      },
    });

    let stocks: any[] = [];
    const stream = Readable.from(response.data);

    stream
      .pipe(csvParser())
      .on("data", (row) => {
        try {
          stocks.push({
            symbol: row["SYMBOL"],
            name: row["NAME OF COMPANY"],
            series: row[" SERIES"]?.trim(),
            dateOfListing: new Date(row[" DATE OF LISTING"]?.trim()),
            paidUpValue: parseInt(row[" PAID UP VALUE"]?.trim(), 10),
            marketLot: parseInt(row[" MARKET LOT"]?.trim(), 10),
            isinNumber: row[" ISIN NUMBER"]?.trim(),
            faceValue: parseInt(row[" FACE VALUE"]?.trim(), 10),
            sector: null, // Sector logic if needed
          });
        } catch (err) {
          console.error("Error processing row:", row, err);
        }
      })
      .on("end", async () => {
        console.log(`✅ Processed ${stocks.length} records.`);
        
        if (stocks.length > 0) {
          await prisma.stock.createMany({
            data: stocks,
            skipDuplicates: true, // Avoid duplicate records
          });

          sendResponse(res, 200, null, "Stock data stored successfully!", stocks);
        } else {
          sendResponse(res, 400, null, "No valid stock data found in CSV.", []);
        }
      })
      .on("error", (err) => {
        console.error("❌ Error while parsing CSV:", err);
        sendResponse(res, 500, null, "Error processing CSV file", []);
      });
  } catch (error: any) {
    console.error("❌ Axios Error:", error.message);

    if (error.code === "ECONNRESET") {
      sendResponse(res, 503, null, "Failed to fetch stock data. Try again later.", []);
    } else {
      sendResponse(res, 500, null, "Unexpected error occurred.", []);
    }
  }
});
