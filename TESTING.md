# StarterForge Testing Guide

## Recommended Testing Stack

**Primary**: **Vitest** - Fast, modern, ESM-native test runner perfect for CLI tools

**Supporting Tools**:
- **Supertest** - HTTP API testing
- **Node.js child_process** - CLI execution testing
- **fs/path** - File system validation

## Why Vitest for StarterForge?

**ESM Native**: Perfect match for our `.mjs` files  
**Fast**: Instant hot-reload for test development  
**CLI Friendly**: Excellent for testing command-line tools  
**Zero Config**: Works immediately with our setup  
**Coverage**: Built-in code coverage with v8  
**Modern**: TypeScript support, great DX  

## Quick Start

### Installation
```bash
npm install --save-dev vitest @vitest/ui supertest
```

### Run Tests
```bash
# Run all tests
npm test

# Watch mode (re-runs on file changes)
npm run test:watch

# UI mode (browser interface)
npm run test:ui

# Coverage report
npm run test:coverage
```

## Test Architecture

### 1. **CLI Tests** (`tests/cli.test.js`)
- Tests all CLI commands and options
- Validates generated file structure  
- Checks different project types and modes
- Uses `child_process.spawn()` to execute CLI

### 2. **Schema Tests** (`tests/schema.test.js`)
- Validates Zod configuration schema
- Tests all valid/invalid configurations
- Ensures proper error messages

### 3. **API Tests** (`tests/api.test.js`)
- Tests Express web server endpoints
- Validates `/api/generate` functionality
- Tests error handling and responses

### 4. **Integration Tests**
- End-to-end project generation
- Validates complete workflow
- Tests file contents and structure

## Example Test Cases

### CLI Testing Pattern
```javascript
// Helper to run CLI commands
async function runCLI(configFile, options = []) {
  return new Promise((resolve) => {
    const child = spawn('node', ['starterforge-cli.mjs', configFile, ...options])
    // ... handle stdout/stderr/exit
  })
}

test('generates web app project', async () => {
  const result = await runCLI('test-config.json')
  expect(result.exitCode).toBe(0)
  expect(result.stdout).toContain('✅ Files scaffolded')
})
```

### File Validation Pattern
```javascript
test('generates correct package.json', () => {
  const pkg = JSON.parse(readFileSync('output/web_app/package.json', 'utf-8'))
  expect(pkg.dependencies.express).toBeDefined()
  expect(pkg.scripts.start).toBe('node src/index.js')
})
```

### API Testing Pattern
```javascript
test('POST /api/generate', async () => {
  const response = await fetch('/api/generate', {
    method: 'POST',
    body: JSON.stringify(testConfig)
  })
  expect(response.status).toBe(200)
})
```

## Test Configuration

### **vitest.config.js**
```javascript
export default defineConfig({
  test: {
    include: ['**/*.{test,spec}.{js,mjs,ts}'],
    environment: 'node',
    testTimeout: 30000, // CLI can be slow
    globalSetup: './tests/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
})
```

### **Test Setup** (`tests/setup.js`)
- Cleans output directories before tests
- Sets environment variables
- Prepares test fixtures

## Test Commands Explained

### `npm test`
Runs all tests once (CI mode)
```bash
✓ CLI generates projects correctly
✓ Schema validates configurations  
✓ API endpoints work
✓ Generated files have correct content
```

### `npm run test:watch`
Continuous testing during development
```bash
# Watches for file changes and re-runs tests
# Perfect for TDD workflow
```

### `npm run test:ui`
Browser-based test interface
```bash
# Opens http://localhost:51204/__vitest__/
# Visual test runner with file explorer
# Great for debugging test failures
```

### `npm run test:coverage`
Generates code coverage report
```bash
# Creates coverage/ directory with HTML report
# Shows which code paths are tested
```

## Test Categories

### **Unit Tests**
- Individual function testing
- Schema validation
- Utility functions
- Fast execution

### **Integration Tests**
- CLI end-to-end testing  
- File generation validation
- API endpoint testing
- Realistic scenarios

### **Smoke Tests**
- Basic functionality works
- All project types generate
- No crashes or errors
- Quick verification

## Coverage Goals

Target coverage metrics:
- **CLI Core**: 90%+ (critical path)
- **Schema Validation**: 100% (data integrity)  
- **File Generation**: 85%+ (output quality)
- **API Endpoints**: 90%+ (web interface)

## Testing Best Practices

### **Test Organization**
- One test file per major component
- Descriptive test names
- Group related tests with `describe()`
- Use `beforeEach`/`afterEach` for setup/cleanup

### **Assertions**
- Test behavior, not implementation
- Use specific matchers (`toBe`, `toContain`, etc.)
- Test error conditions explicitly
- Validate file contents, not just existence

### **Test Data**
- Use realistic configurations
- Test edge cases and invalid inputs
- Keep test configs simple and focused
- Clean up generated files after tests

### **Performance**
- Tests should be fast (< 30s total)
- Use `singleFork` to prevent file conflicts
- Clean up resources properly
- Mock external dependencies when possible

## Common Testing Scenarios

### **Must Test**
- All 6 project types generate successfully
- All CLI modes work (`--mode` options)
- Schema validation catches invalid configs
- Generated files have correct content
- Web API generates projects correctly
- Error handling works properly

### **Should Test**
- Different framework combinations
- Database schema generation  
- Auth provider configurations
- File permissions are correct
- Environment variable generation

### **Nice to Have**
- Performance benchmarks
- Generated project functionality
- Cross-platform compatibility
- Memory usage validation

## Ready to Test!

With this setup, you can:

1. **Run comprehensive tests** covering CLI, API, and file generation
2. **Develop with confidence** using watch mode
3. **Debug visually** with the UI interface  
4. **Track coverage** to ensure quality
5. **Automate in CI** with simple `npm test`

The testing framework will catch regressions and ensure StarterForge generates high-quality projects consistently!