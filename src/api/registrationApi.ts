import apiClient, { handleApiError } from './apiClient';

// Request Types
export interface SendRegistrationOtpRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface VerifyRegistrationOtpRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    otp: string;
}

// Response Types
export interface SendRegistrationOtpResponse {
    message: string;
}

export interface VerifyRegistrationOtpResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        accessToken: string;
        refreshToken: string;
        user: {
            id: string; // UUID from backend
            email: string;
            firstName: string;
            lastName: string;
            role: string;
        };
        message: string;
    };
}

/**
 * Send registration OTP
 */
export const sendRegistrationOtp = async (data: SendRegistrationOtpRequest): Promise<SendRegistrationOtpResponse> => {
    try {
        const response = await apiClient.post<SendRegistrationOtpResponse>(
            '/auth/send-registration-otp',
            data
        );
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};

/**
 * Verify registration OTP and complete signup
 */
export const verifyRegistrationOtp = async (data: VerifyRegistrationOtpRequest): Promise<VerifyRegistrationOtpResponse> => {
    try {
        const response = await apiClient.post<VerifyRegistrationOtpResponse>(
            '/auth/verify-registration-otp',
            data
        );
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};
