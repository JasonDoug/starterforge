import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Test files pattern
    include: ['**/*.{test,spec}.{js,mjs,ts}'],
    
    // Environment
    environment: 'node',
    
    // Test timeout (CLI generation can be slow)
    testTimeout: 30000,
    
    // Global setup/teardown
    globalSetup: './tests/setup.js',
    
    // Coverage settings
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'output/',
        'web/',
        '**/*.config.*'
      ]
    },
    
    // Concurrent tests (careful with file system)
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true // Prevent file conflicts
      }
    }
  }
})