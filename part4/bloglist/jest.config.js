/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/tests/**/*.js', '**/?(*.)+(spec|test).js'],
  bail: 10,
  clearMocks: true,
  coverageProvider: 'v8',

  // roots: [
  //   "<rootDir>"
  // ],
  setupFilesAfterEnv: ['./setupTests.js'],
}

module.exports = config
