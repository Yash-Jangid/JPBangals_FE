import axios from 'axios';
import { API_CONFIG, getApiUrl } from '../../config/api.config';
import { getAccessToken, getRefreshToken, saveAccessToken, saveRefreshToken, clearAuthData } from '../../utils/storage';

export interface TokenPayload {
    exp: number;
    iat: number;
    sub: string;
}

class AuthService {
    private refreshTokenPromise: Promise<string | null> | null = null;
    private onAuthFailure?: () => void;


    public setAuthFailureListener(callback: () => void): void {
        this.onAuthFailure = callback;
    }

    private b64Decode(str: string): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        let output = '';
        str = String(str).replace(/=+$/, '');
        if (str.length % 4 === 1) throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
        for (
            let bc = 0, bs = 0, buffer, i = 0;
            (buffer = str.charAt(i++));
            ~buffer && (bc = bc % 4 ? bc * 64 + bs : bs, bc++ % 4)
                ? (output += String.fromCharCode(255 & (bc >> ((-2 * bc) & 6))))
                : 0
        ) {
            bs = chars.indexOf(buffer);
        }
        return output;
    }

    public isTokenExpired(token: string | null): boolean {
        if (!token) return true;
        try {
            const base64Url = token.split('.')[1];
            if (!base64Url) return true;
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

            const atobFunc = (global as any).atob || this.b64Decode;
            const decoded = atobFunc(base64);

            const jsonPayload = decodeURIComponent(
                decoded.split('').map((c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
            );

            const { exp }: TokenPayload = JSON.parse(jsonPayload);
            const now = Math.floor(Date.now() / 1000);
            const bufferTime = 120; // 2 minutes buffer for clock drift

            return now > (exp - bufferTime);
        } catch (e) {
            if (__DEV__) console.warn('⚠️ [Auth] Error decoding token:', e);
            return true;
        }
    }


    public async performTokenRefresh(): Promise<string | null> {
        if (this.refreshTokenPromise) {
            return this.refreshTokenPromise;
        }

        this.refreshTokenPromise = (async () => {
            try {
                const refreshToken = await getRefreshToken();
                if (!refreshToken) throw new Error('NO_REFRESH');

                if (__DEV__) console.log('🔄 [Auth] Starting token refresh rotation...');

                const response = await axios.post(
                    getApiUrl(API_CONFIG.ENDPOINTS.AUTH.REFRESH),
                    { refreshToken },
                    { timeout: 15000 }
                );

                const tokens = response.data?.data || response.data;
                const { accessToken, refreshToken: newRefreshToken } = tokens;

                if (!accessToken) throw new Error('NO_ACCESS_TOKEN');

                await saveAccessToken(accessToken);
                if (newRefreshToken) {
                    await saveRefreshToken(newRefreshToken);
                }

                if (__DEV__) console.log('✨ [Auth] Token refreshed successfully');
                return accessToken;
            } catch (error: any) {
                const status = error.response?.status;
                if (status === 401 || status === 403 || error.message === 'NO_REFRESH') {
                    await clearAuthData();
                    this.onAuthFailure?.();
                }
                return null;
            } finally {
                this.refreshTokenPromise = null;
            }
        })();

        return this.refreshTokenPromise;
    }

    public notifyAuthFailure(): void {
        this.onAuthFailure?.();
    }
}

export const authService = new AuthService();
export default authService;
