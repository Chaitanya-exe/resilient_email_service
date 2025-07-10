import { EmailQueue } from '../../src/core/queue.js';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';


describe('EmailQueue', () => {
    let queue;
    let mockEmailService;
    
    beforeEach(() => {
        mockEmailService = {
            send: jest.fn()
        };
        queue = new EmailQueue(mockEmailService);
    });
    
    it('should initialize empty queue', () => {
        expect(queue.size()).toBe(0);
    });
    
    it('should enqueue email', () => {
        const email = { id: 'test-id' };
        queue.enqueue(email);
        expect(queue.size()).toBe(1);
    });
    
    it('should process successful emails and remove them from queue', async () => {
        const email1 = { id: 'test-id-1' };
        const email2 = { id: 'test-id-2' };
        
        mockEmailService.send.mockResolvedValueOnce('SUCCESS');
        mockEmailService.send.mockResolvedValueOnce('DUPLICATE');
        
        queue.enqueue(email1);
        queue.enqueue(email2);
        
        await queue.process();
        
        expect(queue.size()).toBe(0);
        expect(mockEmailService.send).toHaveBeenCalledTimes(2);
    });
    
    it('should keep failed emails in the queue', async () => {
        const email1 = { id: 'test-id-1' };
        const email2 = { id: 'test-id-2' };
        
        mockEmailService.send.mockResolvedValueOnce('SUCCESS');
        mockEmailService.send.mockResolvedValueOnce('FAILED');
        
        queue.enqueue(email1);
        queue.enqueue(email2);
        
        await queue.process();
        
        expect(queue.size()).toBe(1);
        expect(mockEmailService.send).toHaveBeenCalledTimes(2);
    });
    
    it('should keep rate limited emails in the queue', async () => {
        const email = { id: 'test-id-1' };
        
        mockEmailService.send.mockResolvedValueOnce('RATE_LIMITED');
        
        queue.enqueue(email);
        
        await queue.process();
        
        expect(queue.size()).toBe(1);
        expect(mockEmailService.send).toHaveBeenCalledTimes(1);
    });
});
