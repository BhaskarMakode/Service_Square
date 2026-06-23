/**
 * Backend Test Setup
 * Initializes test environment with MongoDB memory server, Redis mock, and global test utilities
 */

const { MongoMemoryServer } = require('mongodb-memory-server');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');

let mongoServer;

/**
 * Setup test environment before all tests
 */
beforeAll(async () => {
  // Load environment variables from .env or .env.test
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
  dotenv.config({ path: path.resolve(__dirname, '../.env.test') });

  // Set test-specific environment variables (override any existing)
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key-do-not-use-in-production';
  process.env.JWT_EXPIRE = process.env.JWT_EXPIRE || '24h';
  process.env.PORT = process.env.PORT || 5001; // Use different port for tests
  process.env.REDIS_HOST = process.env.REDIS_HOST || 'localhost';
  process.env.REDIS_PORT = process.env.REDIS_PORT || 6379;
  process.env.REDIS_PASSWORD = process.env.REDIS_PASSWORD || '';
  process.env.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000,http://localhost:5173';

  // Start MongoDB Memory Server
  try {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    process.env.MONGO_URI = mongoUri;
    
    // Connect mongoose to memory server
    await mongoose.connect(mongoUri);
    console.log('✓ Test MongoDB Memory Server started');
  } catch (error) {
    console.error('Failed to start MongoDB Memory Server:', error);
    throw error;
  }
});

/**
 * Cleanup after all tests
 */
afterAll(async () => {
  try {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
    console.log('✓ Test MongoDB Memory Server stopped');
  } catch (error) {
    console.error('Error during test cleanup:', error);
  }
});

/**
 * Clear mocks between tests
 */
afterEach(() => {
  jest.clearAllMocks();
});

module.exports = {
  mongoServer
};
