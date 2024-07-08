require('dotenv').config({ path: '.env' });

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/**/*.test.ts'],
  setupFilesAfterEnv: ['dotenv/config'],
  openHandlesTimeout: 2000,
};
