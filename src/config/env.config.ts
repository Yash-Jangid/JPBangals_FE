import Config from 'react-native-config';
export const ENV_CONFIG = {
    API_BASE_URL: Config.API_BASE_URL || 'https://bangles-jaipur-backend.onrender.com',
    isDevelopment: __DEV__,
    isProduction: !__DEV__,
} as const;

// Export commonly used values for convenience
export const { API_BASE_URL } = ENV_CONFIG;

// Default export for easier imports
export default ENV_CONFIG;
