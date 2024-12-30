class ApiResponse {
    statusCode: number;
    data: any;
    message: string;
    success: boolean;
    errors: any[];

    constructor(statusCode: number, data: any = null, message: string = "Success", errors: any[] = []) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
        this.errors = errors;
    }
}

export const sendResponse = (res: any, status: number, data: any = null, message: string = '', errors: any[] = []) => {
    return res.status(status).json(new ApiResponse(status, data, message, errors));
};
export { ApiResponse };
