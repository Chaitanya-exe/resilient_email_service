// Common mock setup for all tests
import { jest } from '@jest/globals';

// Mock the logger to avoid any console output during tests
jest.mock('../src/core/logger.js', () => {
  return {
    __esModule: true,
    default: jest.fn()
  };
});
