import { Request, Response, NextFunction } from 'express';
const { constants } = require("../constant");

interface ErrorResponse {
    title: string;
    message: string;
    stackTrace?: string;
}

const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    let errorResponse: ErrorResponse;

    switch (statusCode) {
        case constants.VALIDATION_ERROR:
            errorResponse = {
                title: "Validation Error",
                message: err.message,
                stackTrace: process.env.NODE_ENV === 'development' ? err.stack : undefined
            };
            break;

        case constants.NOT_FOUND:
            errorResponse = {
                title: "Not Found",
                message: err.message,
                stackTrace: process.env.NODE_ENV === 'development' ? err.stack : undefined
            };
            break;

        case constants.UNAUTHORIZATION:
            errorResponse = {
                title: "Unauthorized",
                message: err.message,
                stackTrace: process.env.NODE_ENV === 'development' ? err.stack : undefined
            };
            break;

        case constants.FORBIDDEN:
            errorResponse = {
                title: "Forbidden",
                message: err.message,
                stackTrace: process.env.NODE_ENV === 'development' ? err.stack : undefined
            };
            break;

        case constants.SERVER_ERROR:
            errorResponse = {
                title: "Server Error",
                message: err.message,
                stackTrace: process.env.NODE_ENV === 'development' ? err.stack : undefined
            };
            break;

        default:
            console.log("No error, All good");
            errorResponse = {
                title: "Success",
                message: "Operation completed successfully"
            };
            break;
    }

    res.status(statusCode).json(errorResponse);
};

export default errorHandler;
