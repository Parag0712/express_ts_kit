import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ApiResponse } from "./ApiResponse.js";
// format error for zod
export const formatError = (error: ZodError): any => {
    let errors: any = {};
    error.errors?.map((issue) => {
        errors[issue.path[0]] = issue.message;
    })
    return errors;
}

type AsyncRequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<any>;


export const asyncHandler = (fn: AsyncRequestHandler) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        // Capture the original json method

        try {
            await fn(req, res, next);

        } catch (error) {
            console.log(error + "error");
            if (error instanceof ZodError) {
                const errors = formatError(error);
                res.status(422).json(
                    new ApiResponse(422, null, "Validation Error", errors)
                )
            } else {
                res.status(500).json(
                    new ApiResponse(500, null, "Internal Server Error", [error])
                )
            }
        }
    };
};

export default asyncHandler;
