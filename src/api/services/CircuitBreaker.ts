import { store } from '../../store';
import { setServiceUnavailable } from '../../store/slices/appSettingsSlice';

export interface CircuitBreakerConfig {
    MAX_CONSECUTIVE_FAILURES: number;
    CIRCUIT_RESET_TIMEOUT: number;
}

class CircuitBreaker {
    private config: CircuitBreakerConfig = {
        MAX_CONSECUTIVE_FAILURES: 5,
        CIRCUIT_RESET_TIMEOUT: 30000,
    };

    private consecutiveFailures = 0;
    private circuitOpenUntil = 0;

    constructor(config?: Partial<CircuitBreakerConfig>) {
        if (config) {
            this.config = { ...this.config, ...config };
        }
    }

    /**
     * Check if circuit breaker is open
     */
    public isOpen(): boolean {
        const now = Date.now();
        if (now < this.circuitOpenUntil) {
            return true;
        }

        // Circuit timeout elapsed, reset
        if (this.circuitOpenUntil > 0 && now >= this.circuitOpenUntil) {
            this.reset();
        }
        return false;
    }

    /**
     * Record a failure and potentially open the circuit
     */
    public recordFailure(): void {
        this.consecutiveFailures++;

        if (this.consecutiveFailures >= this.config.MAX_CONSECUTIVE_FAILURES) {
            this.circuitOpenUntil = Date.now() + this.config.CIRCUIT_RESET_TIMEOUT;
            if (__DEV__) {
                console.error(`🚨 [Circuit Breaker] OPEN for ${this.config.CIRCUIT_RESET_TIMEOUT / 1000}s`);
            }
            store.dispatch(setServiceUnavailable(true));
        }
    }

    /**
     * Record a success and reset failure count
     */
    public recordSuccess(): void {
        if (this.consecutiveFailures > 0) {
            this.reset();
        }
    }

    /**
     * Reset the circuit breaker state
     */
    public reset(): void {
        if (__DEV__ && this.circuitOpenUntil > 0) {
            console.log('🔓 [Circuit Breaker] Circuit CLOSED.');
        }
        this.consecutiveFailures = 0;
        this.circuitOpenUntil = 0;
        store.dispatch(setServiceUnavailable(false));
    }

    /**
     * Get remaining open time in milliseconds
     */
    public getRemainingTime(): number {
        return Math.max(0, this.circuitOpenUntil - Date.now());
    }
}

export const circuitBreaker = new CircuitBreaker();
export default CircuitBreaker;
