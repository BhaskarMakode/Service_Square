/**
 * Vitest Global Setup File
 * Configures:
 * - DOM globals and cleanup
 * - Fetch/HTTP mock
 * - Local storage mock
 * - Window globals
 * - Test utilities
 */

import '@testing-library/jest-dom';
import { expect, afterEach, vi, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';

/**
 * Cleanup after each test
 */
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

/**
 * Mock environment variables
 */
beforeEach(() => {
  process.env.VITE_API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  process.env.VITE_API_V1_BASE_URL = process.env.VITE_API_V1_BASE_URL || 'http://localhost:5000/api/v1';
  process.env.VITE_ENV = process.env.VITE_ENV || 'test';
});

/**
 * Mock fetch API
 */
global.fetch = vi.fn((url, options = {}) => {
  // Default success response
  return Promise.resolve({
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: new Headers({ 'content-type': 'application/json' }),
    json: async () => ({ success: true, data: {} }),
    text: async () => '',
    clone: function() { return this; },
    blob: async () => new Blob(),
    arrayBuffer: async () => new ArrayBuffer(0)
  });
});

/**
 * Mock local storage
 */
const localStorageMock = {
  getItem: vi.fn((key) => null),
  setItem: vi.fn((key, value) => {}),
  removeItem: vi.fn((key) => {}),
  clear: vi.fn(() => {}),
  length: 0,
  key: vi.fn((index) => null)
};

global.localStorage = localStorageMock;

/**
 * Mock session storage
 */
const sessionStorageMock = {
  getItem: vi.fn((key) => null),
  setItem: vi.fn((key, value) => {}),
  removeItem: vi.fn((key) => {}),
  clear: vi.fn(() => {}),
  length: 0,
  key: vi.fn((index) => null)
};

global.sessionStorage = sessionStorageMock;

/**
 * Mock window.matchMedia
 */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
});

/**
 * Mock IntersectionObserver
 */
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};

/**
 * Mock ResizeObserver
 */
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

/**
 * Suppress console errors and warnings in tests
 */
const originalError = console.error;
const originalWarn = console.warn;

beforeEach(() => {
  console.error = vi.fn();
  console.warn = vi.fn();
});

afterEach(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

/**
 * Mock window.scrollTo
 */
window.scrollTo = vi.fn();

/**
 * Mock navigator.geolocation
 */
Object.defineProperty(global.navigator, 'geolocation', {
  value: {
    getCurrentPosition: vi.fn((success) => {
      success({
        coords: {
          latitude: 40.7128,
          longitude: -74.0060
        }
      });
    }),
    watchPosition: vi.fn()
  }
});

/**
 * Mock window.location
 */
delete window.location;
window.location = {
  href: 'http://localhost:5173',
  pathname: '/',
  search: '',
  hash: '',
  reload: vi.fn(),
  replace: vi.fn(),
  assign: vi.fn()
};

export {};
