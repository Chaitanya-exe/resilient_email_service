import { RateLimiter } from '../../src/core/rateLimiter.js';
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';

describe('RateLimiter', () => {
    let dateSpy;
    
    beforeEach(() => {
        const currentTime = Date.now();
        dateSpy = jest.spyOn(Date, 'now').mockReturnValue(currentTime);
    });
    
    afterEach(() => {
        dateSpy.mockRestore();
    });
    
    it('should allow requests within limit', () => {
        const rateLimiter = new RateLimiter(2, 1000);
        
        expect(rateLimiter.allow()).toBe(true);
        expect(rateLimiter.allow()).toBe(true);
    });
    
    it('should reject requests exceeding limit', () => {
        const rateLimiter = new RateLimiter(2, 1000);
        
        expect(rateLimiter.allow()).toBe(true);
        expect(rateLimiter.allow()).toBe(true);
        expect(rateLimiter.allow()).toBe(false);
    });
    
    it('should remove expired timestamps', () => {
        const rateLimiter = new RateLimiter(2, 1000);
        
        expect(rateLimiter.allow()).toBe(true);
        expect(rateLimiter.allow()).toBe(true);
        
        const currentTime = Date.now();
        dateSpy.mockReturnValue(currentTime + 1001);
        
        expect(rateLimiter.allow()).toBe(true);
        expect(rateLimiter.timestamps.length).toBe(1);
    });
    
    it('should not allow requests when timestamps are not expired but limit reached', () => {
        const rateLimiter = new RateLimiter(2, 1000);
        
        expect(rateLimiter.allow()).toBe(true);
        expect(rateLimiter.allow()).toBe(true);
        
        const currentTime = Date.now();
        dateSpy.mockReturnValue(currentTime + 500);
        
        expect(rateLimiter.allow()).toBe(false);
    });
});
