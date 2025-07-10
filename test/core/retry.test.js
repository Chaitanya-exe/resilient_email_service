import retry from '../../src/core/retry.js';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';


describe('Retry', () => {
    let tryFunc;

    beforeEach(() => {
        tryFunc = jest.fn();
    });

    it('should succeed without retries if successful', async () => {
        tryFunc.mockResolvedValue('SUCCESS');
        const result = await retry(tryFunc);
        expect(result).toBe('SUCCESS');
        expect(tryFunc).toHaveBeenCalledTimes(1);
    });

    it('should retry upon failure', async () => {
        tryFunc.mockRejectedValueOnce(new Error('Failed')).mockResolvedValue('SUCCESS');
        const result = await retry(tryFunc);
        expect(result).toBe('SUCCESS');
        expect(tryFunc).toHaveBeenCalledTimes(2);
    });

    it('should fail after max retries', async () => {
        tryFunc.mockRejectedValue(new Error('Failed'));
        await expect(retry(tryFunc, 2)).rejects.toThrow('some error occured');
        expect(tryFunc).toHaveBeenCalledTimes(3);
    });
});
