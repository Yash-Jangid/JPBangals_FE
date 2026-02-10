import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG, HTTP_STATUS } from '../config/api.config';
import { getAccessToken } from '../utils/storage';
import { circuitBreaker } from './services/CircuitBreaker';
import { authService } from './services/AuthService';

/**
 * Strategy: Public Endpoint Check
 */
const isPublicEndpoint = (url?: string): boolean => {
    if (!url) return false;
    const publicEndpoints = [
        '/auth/login',
        '/auth/register',
        '/auth/forgot-password',
        '/auth/verify-otp',
        '/auth/reset-password',
        '/auth/logout',
        '/auth/refresh',
    ];
    return publicEndpoints.some(endpoint => url.includes(endpoint));
};

// Create axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}`,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        if (isPublicEndpoint(config.url)) {
            if (__DEV__) console.log(`🌐 [Public Request] ${config.method?.toUpperCase()} ${config.url}`);
            return config;
        }

        let accessToken = await getAccessToken();

        // Proactive token refresh if near expiry
        if (accessToken && authService.isTokenExpired(accessToken)) {
            accessToken = await authService.performTokenRefresh();
        }

        if (accessToken && config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        if (__DEV__) console.log(`🚀 [Request] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * Response Interceptor: Success Handling & Reactive Auth
 */
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        circuitBreaker.recordSuccess();
        if (__DEV__) console.log(`✅ [Response] ${response.status} - ${response.config.url}`);
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // Guard: Request was cancelled or has no config
        if (!originalRequest) {
            circuitBreaker.recordFailure();
            return Promise.reject(error);
        }

        // Guard: Circuit Breaker
        if (circuitBreaker.isOpen()) {
            return Promise.reject(new Error(`Circuit open. Retry available in ${Math.ceil(circuitBreaker.getRemainingTime() / 1000)}s`));
        }

        // Strategy: Handle 401 Unauthorized
        if (error.response?.status === HTTP_STATUS.UNAUTHORIZED && !isPublicEndpoint(originalRequest.url)) {
            // Guard: Max retry attempts
            originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
            if (originalRequest._retryCount > 3) {
                circuitBreaker.recordFailure();
                return Promise.reject(error);
            }

            if (__DEV__) console.log(`🔄 [Retry ${originalRequest._retryCount}] Token refresh for ${originalRequest.url}`);

            const newToken = await authService.performTokenRefresh();
            if (newToken) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return apiClient(originalRequest);
            }
        }

        // Generic failure handling
        circuitBreaker.recordFailure();
        return Promise.reject(error);
    }
);

export const setAuthFailureListener = (callback: () => void) => {
    authService.setAuthFailureListener(callback);
};

export const handleApiError = (error: any): string => {
    if (error.response) {
        return error.response.data?.message || error.response.data?.error || 'Server error occurred.';
    }
    if (error.request) {
        return 'Network error. Please check your connection.';
    }
    return error.message || 'An unexpected error occurred.';
};

export default apiClient;
