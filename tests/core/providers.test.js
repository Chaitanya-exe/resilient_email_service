import { MainProvider, FallbackProvider } from '../../src/core/providers.js';
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';

describe('Email Providers', () => {
    beforeEach(() => {
        jest.spyOn(global.Math, 'random').mockReturnValue(0.6);
        jest.spyOn(global, 'setTimeout').mockImplementation(callback => callback());
    });
    
    afterEach(() => {
        jest.restoreAllMocks();
    });
    
    describe('MainProvider', () => {
        it('should initialize with name', () => {
            const provider = new MainProvider('test-provider');
            expect(provider.name).toBe('test-provider');
        });
        
        it('should send email successfully when random > 0.5', async () => {
            const provider = new MainProvider('test-provider');
            const email = { to: 'test@example.com' };
            
            await expect(provider.sendMail(email)).resolves.toBe(true);
        });
        
        it('should throw error when random <= 0.5', async () => {
            jest.spyOn(global.Math, 'random').mockReturnValueOnce(0.5);
            const provider = new MainProvider('test-provider');
            const email = { to: 'test@example.com' };
            
            await expect(provider.sendMail(email)).rejects.toThrow('test-provider failed to send email');
        });
    });
    
    describe('FallbackProvider', () => {
        it('should initialize with name', () => {
            const provider = new FallbackProvider('backup-provider');
            expect(provider.name).toBe('backup-provider');
        });
        
        it('should send email successfully when random > 0.5', async () => {
            const provider = new FallbackProvider('backup-provider');
            const email = { to: 'test@example.com' };
            
            await expect(provider.sendMail(email)).resolves.toBe(true);
        });
        
        it('should throw error when random <= 0.5', async () => {
            jest.spyOn(global.Math, 'random').mockReturnValueOnce(0.5);
            const provider = new FallbackProvider('backup-provider');
            const email = { to: 'test@example.com' };
            
            await expect(provider.sendMail(email)).rejects.toThrow('backup-provider failed to send email');
        });
    });
});
