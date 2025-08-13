/**
 * Unit tests for tests/setup.js
 * Framework: Node.js built-in test runner (node:test) with ESM.
 * If your project uses Jest/Vitest, you can adapt imports:
 *  - Replace: import { test, describe, beforeEach, afterEach } from 'node:test'
 *  - Replace: assert with expect
 */
import { test, describe, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, mkdirSync, writeFileSync, rmSync, readdirSync, statSync } from 'fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Import the module under test
import { setup, teardown } from './setup.js'

// Utilities mirroring the module's path resolution
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.join(__dirname, '..')
const testOutputDir = path.join(projectRoot, 'test-output')

// Capture and restore console logging
let originalConsoleLog
let logs

const resetLogs = () => { logs = [] }
const installLogSpy = () => {
  originalConsoleLog = console.log
  console.log = (...args) => {
    logs.push(args.join(' '))
    return originalConsoleLog.apply(console, args)
  }
}
const restoreLogSpy = () => {
  if (originalConsoleLog) console.log = originalConsoleLog
}

describe('tests/setup.js - environment setup and teardown', () => {
  beforeEach(() => {
    // Ensure a clean starting state for each test
    try { rmSync(testOutputDir, { recursive: true, force: true }) } catch {}
    delete process.env.STARTERFORGE_OUTPUT_DIR
    // Reset logs
    resetLogs()
    installLogSpy()
  })

  afterEach(() => {
    restoreLogSpy()
    // Clean up artifacts we may have created
    try { rmSync(testOutputDir, { recursive: true, force: true }) } catch {}
  })

  test('setup() creates the test-output directory and sets environment variables', async () => {
    assert.equal(existsSync(testOutputDir), false, 'Precondition: test-output should not exist')

    await setup()

    assert.equal(process.env.NODE_ENV, 'test')
    assert.equal(process.env.STARTERFORGE_OUTPUT_DIR, testOutputDir)
    assert.equal(existsSync(testOutputDir), true, 'test-output directory should be created')

    // Validate logging
    const combined = logs.join('\n')
    assert.match(combined, /Setting up test environment/, 'Should log setup message')
  })

  test('setup() is idempotent and cleans previous contents of test-output', async () => {
    // Pre-create directory with files and subdirectories
    mkdirSync(testOutputDir, { recursive: true })
    const staleFile = path.join(testOutputDir, 'stale.txt')
    const subDir = path.join(testOutputDir, 'nested')
    mkdirSync(subDir, { recursive: true })
    const nestedFile = path.join(subDir, 'old.bin')
    writeFileSync(staleFile, 'to be removed')
    writeFileSync(nestedFile, 'old content')

    // Verify preconditions
    assert.equal(existsSync(staleFile), true)
    assert.equal(existsSync(nestedFile), true)

    // First run cleans and recreates directory
    await setup()
    assert.equal(existsSync(staleFile), false, 'Stale file should be removed by setup')
    assert.equal(existsSync(nestedFile), false, 'Nested file should be removed by setup')
    assert.equal(existsSync(testOutputDir), true, 'Directory is recreated by setup')

    // Second run should still succeed without error
    await setup()
    assert.equal(existsSync(testOutputDir), true, 'Directory should still exist after second setup')
    // Directory should be empty immediately after setup (except for filesystem metadata)
    const entries = readdirSync(testOutputDir)
    assert(Array.isArray(entries))
    assert.equal(entries.length, 0, 'test-output should be empty after setup')
  })

  test('setup() handles missing directory gracefully (no throw)', async () => {
    // Directory should not exist
    assert.equal(existsSync(testOutputDir), false, 'Precondition: test-output should not exist')
    // Calling setup should not throw and should create it
    await setup()
    assert.equal(existsSync(testOutputDir), true, 'Directory should be created')
    const stat = statSync(testOutputDir)
    assert.equal(stat.isDirectory(), true)
  })

  test('teardown() logs cleanup message and does not remove directory by default', async () => {
    // Ensure directory exists
    await setup()
    assert.equal(existsSync(testOutputDir), true, 'Precondition: directory exists after setup')

    resetLogs()
    await teardown()

    // Validate logging
    const combined = logs.join('\n')
    assert.match(combined, /Cleaning up test environment/, 'Should log teardown message')

    // By current implementation, teardown does NOT remove directory (cleanup is commented out)
    assert.equal(existsSync(testOutputDir), true, 'Directory should remain after teardown per current implementation')
  })

  test('environment variables are consistent across multiple setup calls', async () => {
    await setup()
    assert.equal(process.env.NODE_ENV, 'test')
    assert.equal(process.env.STARTERFORGE_OUTPUT_DIR, testOutputDir)

    // Mutate env to simulate interference
    process.env.NODE_ENV = 'development'
    process.env.STARTERFORGE_OUTPUT_DIR = 'somewhere-else'

    await setup()
    assert.equal(process.env.NODE_ENV, 'test', 'setup should reset NODE_ENV')
    assert.equal(process.env.STARTERFORGE_OUTPUT_DIR, testOutputDir, 'setup should reset STARTERFORGE_OUTPUT_DIR')
  })
})