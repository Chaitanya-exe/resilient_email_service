import { EmailService } from '../../src/core/emailService.js';
import { CircuitBreaker } from '../../src/core/circuitBreaker.js';
import { RateLimiter } from '../../src/core/rateLimiter.js';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';


describe('EmailService', () => {
    let emailService;
    let mockProviders;
    let mockRateLimiter;
    let mockCircuitBreaker;

    beforeEach(() => {
        mockCircuitBreaker = {
            canRequest: jest.fn().mockReturnValue(true),
            recordSuccess: jest.fn(),
            recordFailure: jest.fn()
        };

        mockProviders = [
            {
                instance: {
                    name: 'test-provider',
                    sendMail: jest.fn().mockResolvedValue(true)
                },
                circuit: mockCircuitBreaker
            }
        ];

        mockRateLimiter = {
            allow: jest.fn().mockReturnValue(true)
        };

        emailService = new EmailService(mockProviders, mockRateLimiter);
    });

    it('should send email successfully', async () => {
        const email = { id: 'test-id', to: 'test@example.com' };
        const result = await emailService.send(email);
        
        expect(result).toBe('SUCCESS');
        expect(mockProviders[0].instance.sendMail).toHaveBeenCalledWith(email);
        expect(mockCircuitBreaker.recordSuccess).toHaveBeenCalled();
    });

    it('should return DUPLICATE for emails with same id', async () => {
        const email = { id: 'test-id', to: 'test@example.com' };
        await emailService.send(email);
        const result = await emailService.send(email);
        
        expect(result).toBe('DUPLICATE');
    });

    it('should return RATE_LIMITED when rate limiter denies', async () => {
        mockRateLimiter.allow.mockReturnValueOnce(false);
        const email = { id: 'test-id-2', to: 'test@example.com' };
        const result = await emailService.send(email);
        
        expect(result).toBe('RATE_LIMITED');
        expect(mockProviders[0].instance.sendMail).not.toHaveBeenCalled();
    });

    it('should skip provider when circuit is open', async () => {
        mockCircuitBreaker.canRequest.mockReturnValueOnce(false);
        const email = { id: 'test-id-3', to: 'test@example.com' };
        const result = await emailService.send(email);
        
        expect(result).toBeUndefined();
        expect(mockProviders[0].instance.sendMail).not.toHaveBeenCalled();
    });
});
