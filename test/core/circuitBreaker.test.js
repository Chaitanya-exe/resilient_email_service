import { CircuitBreaker } from '../../src/core/circuitBreaker.js';
import { describe, it, expect } from '@jest/globals';

describe('CircuitBreaker', () => {
    it('should initialize with default values', () => {
        const cb = new CircuitBreaker();
        expect(cb.threshold).toBe(3);
        expect(cb.resetTimeout).toBe(10000);
        expect(cb.state).toBe('CLOSED');
    });

    it('should record failure', () => {
        const cb = new CircuitBreaker(1);
        cb.recordFailure();
        expect(cb.state).toBe('OPEN');
    });

    it('should allow request in CLOSED state', () => {
        const cb = new CircuitBreaker();
        expect(cb.canRequest()).toBe(true);
    });
});

