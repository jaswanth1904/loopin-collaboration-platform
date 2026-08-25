import type { ApiResponse } from '@/types';

export function successResponse<T>(data: T): ApiResponse<T> {
    return { success: true, data };
}

export function errorResponse(
    code: string,
    message: string
): ApiResponse<never> {
    return {
        success: false,
        error: { code, message },
    };
}

export class AppError extends Error {
    constructor(
        public code: string,
        message: string,
        public statusCode: number = 400
    ) {
        super(message);
        this.name = 'AppError';
    }
}
