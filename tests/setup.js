import { rmSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.join(__dirname, '..')
const testOutputDir = path.join(projectRoot, 'test-output')

export async function setup() {
  console.log('🧪 Setting up test environment...')
  
  // Clean test output directory
  try {
    rmSync(testOutputDir, { recursive: true, force: true })
  } catch (e) {
    // Directory might not exist
  }
  
  // Create fresh test output directory
  mkdirSync(testOutputDir, { recursive: true })
  
  // Set test environment variables
  process.env.NODE_ENV = 'test'
  process.env.STARTERFORGE_OUTPUT_DIR = testOutputDir
}

export async function teardown() {
  console.log('🧹 Cleaning up test environment...')
  
  // Clean up test files (optional - useful for debugging to leave them)
  // rmSync(testOutputDir, { recursive: true, force: true })
}