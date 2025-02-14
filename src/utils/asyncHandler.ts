import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { formatError } from "./helper.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import jwt from "jsonwebtoken";
import { ApiResponse } from "./ApiResponse.js";
import logger from "../config/logger.js";
type AsyncRequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction,
) => Promise<any>;

const asyncHandler = (fn: AsyncRequestHandler) => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            await fn(req, res, next);
        } catch (error) {
            // More comprehensive error handling
            logger.error("Request processing error", {
                error,
                path: req.path,
                method: req.method,
            });
            console.log(error);

            if (error instanceof ZodError) {
                const errors = formatError(error);
                res.status(422).json(
                    new ApiResponse(422, null, "Validation Error", errors),
                );
            } else if (error instanceof PrismaClientKnownRequestError) {
                // Handle Prisma-specific errors
                res.status(400).json(
                    new ApiResponse(400, null, "Database Error", [
                        error.message,
                    ]),
                );
            } else if (error instanceof jwt.JsonWebTokenError) {
                res.status(401).json(
                    new ApiResponse(401, null, "Unauthorized", [error.message]),
                );
            } else {
                // Generic error handling
                res.status(500).json(
                    new ApiResponse(500, null, "Internal Server Error", [
                        {
                            message:
                                error instanceof Error
                                    ? error.message
                                    : String(error),
                        },
                    ]),
                );
            }
        }
    };
};

export default asyncHandler;