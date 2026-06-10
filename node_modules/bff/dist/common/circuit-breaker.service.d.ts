export declare class CircuitBreakerService {
    private readonly logger;
    runWithCircuitBreaker<T>(serviceName: string, action: () => Promise<T>, fallbackAction: () => Promise<T>): Promise<T>;
}
