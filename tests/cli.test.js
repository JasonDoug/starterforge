import { test, expect, describe, beforeEach } from 'vitest'
import { spawn } from 'child_process'
import { readFileSync, existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.join(__dirname, '..')
const cliPath = path.join(projectRoot, 'starterforge-cli.mjs')

// Helper function to run CLI with new subcommand structure
async function runCLI(args = [], options = {}) {
  return new Promise((resolve) => {
    const child = spawn('node', [cliPath, ...args], { 
      stdio: 'pipe',
      cwd: projectRoot,
      timeout: options.timeout || 30000
    })

    let stdout = ''
    let stderr = ''

    child.stdout.on('data', (data) => {
      stdout += data.toString()
    })

    child.stderr.on('data', (data) => {
      stderr += data.toString()
    })

    child.on('close', (code) => {
      resolve({ exitCode: code, stdout, stderr })
    })

    // Handle timeout
    if (options.timeout) {
      setTimeout(() => {
        child.kill('SIGTERM')
        resolve({ exitCode: -1, stdout, stderr: 'Timeout' })
      }, options.timeout)
    }
  })
}

// Helper for backwards compatibility testing
async function runCLILegacy(configFile, options = []) {
  return new Promise((resolve) => {
    const args = [cliPath, path.join(projectRoot, configFile), ...options]
    const child = spawn('node', args, { 
      stdio: 'pipe',
      cwd: projectRoot 
    })

    let stdout = ''
    let stderr = ''

    child.stdout.on('data', (data) => {
      stdout += data.toString()
    })

    child.stderr.on('data', (data) => {
      stderr += data.toString()
    })

    child.on('close', (code) => {
      resolve({ exitCode: code, stdout, stderr })
    })
  })
}

describe('StarterForge CLI - New Structure', () => {
  test('shows main help with all subcommands', async () => {
    const result = await runCLI(['--help'])
    expect(result.stdout).toContain('The Ultimate Project Scaffold Generator')
    expect(result.stdout).toContain('generate')
    expect(result.stdout).toContain('create')
    expect(result.stdout).toContain('list')
  })

  test('shows generate command help', async () => {
    const result = await runCLI(['generate', '--help'])
    expect(result.stdout).toContain('Generate project from configuration file')
    expect(result.stdout).toContain('--config <path>')
    expect(result.stdout).toContain('--mode <mode>')
  })

  test('shows create command help', async () => {
    const result = await runCLI(['create', '--help'])
    expect(result.stdout).toContain('Create project with interactive wizard')
    expect(result.stdout).toContain('--interactive')
  })

  test('shows list command help', async () => {
    const result = await runCLI(['list', '--help'])
    expect(result.stdout).toContain('List available options')
    expect(result.stdout).toContain('frameworks')
    expect(result.stdout).toContain('databases')
  })

  test('generates web_app project with generate command', async () => {
    const result = await runCLI(['generate', '--config', 'tests/fixtures/test-config.json'])
    
    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain('Generating web_app project')
    expect(result.stdout).toContain('Project generated successfully!')
    
    // Check files were created
    expect(existsSync('output/web_app/README.md')).toBe(true)
    expect(existsSync('output/web_app/package.json')).toBe(true)
    expect(existsSync('output/web_app/scaffold.sh')).toBe(true)
  })

  test('generates CLI tool project', async () => {
    const result = await runCLI(['generate', '--config', 'tests/fixtures/test-cli.json'])
    
    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain('Generating cli_tool project')
    expect(existsSync('output/cli_tool/src/cli.py')).toBe(true)
    expect(existsSync('output/cli_tool/requirements.txt')).toBe(true)
  })

  test('handles script-only mode', async () => {
    const result = await runCLI(['generate', '--config', 'tests/fixtures/test-config.json', '--mode', 'script-only'])
    
    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain('Script saved')
    expect(result.stdout).not.toContain('Files scaffolded')
  })

  test('handles scaffold-only mode', async () => {
    const result = await runCLI(['generate', '--config', 'tests/fixtures/test-config.json', '--mode', 'scaffold-only'])
    
    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain('Files scaffolded')
    expect(result.stdout).not.toContain('Script saved')
  })

  test('fails with missing config file', async () => {
    const result = await runCLI(['generate'])
    
    expect(result.exitCode).toBe(1)
    expect(result.stderr).toContain('Config file path is required')
  })

  test('fails with invalid config file', async () => {
    const result = await runCLI(['generate', '--config', 'nonexistent-config.json'])
    
    expect(result.exitCode).toBe(1)
    expect(result.stderr).toContain('Failed to load')
  })
})

// Test new list commands
describe('StarterForge CLI - List Commands', () => {
  test('lists frontend frameworks', async () => {
    const result = await runCLI(['list', 'frameworks'])
    
    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain('Available Frontend Frameworks:')
    expect(result.stdout).toContain('React (react)')
    expect(result.stdout).toContain('Vue.js (vue)')
    expect(result.stdout).toContain('Svelte (svelte)')
  })

  test('lists database engines', async () => {
    const result = await runCLI(['list', 'databases'])
    
    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain('Available Databases:')
    expect(result.stdout).toContain('PostgreSQL (postgresql)')
    expect(result.stdout).toContain('MySQL (mysql)')
    expect(result.stdout).toContain('MongoDB (mongodb)')
  })

  test('lists backend options', async () => {
    const result = await runCLI(['list', 'backends'])
    
    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain('Available Backend Options:')
    expect(result.stdout).toContain('Node.js + Express')
    expect(result.stdout).toContain('Python + FastAPI')
  })

  test('lists auth providers', async () => {
    const result = await runCLI(['list', 'auth'])
    
    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain('Available Auth Providers:')
    expect(result.stdout).toContain('Auth0')
    expect(result.stdout).toContain('Clerk')
  })

  test('lists project types', async () => {
    const result = await runCLI(['list', 'types'])
    
    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain('Available Project Types:')
    expect(result.stdout).toContain('Web Application')
    expect(result.stdout).toContain('Frontend Only')
  })
})

// Test backwards compatibility
describe('StarterForge CLI - Backwards Compatibility', () => {
  test('still works with direct config file usage', async () => {
    const result = await runCLILegacy('tests/fixtures/test-config.json')
    
    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain('Generating web_app project from config file')
    expect(result.stdout).toContain('Project generated successfully!')
  })

  test('still works with legacy mode flags', async () => {
    const result = await runCLILegacy('tests/fixtures/test-config.json', ['--mode', 'script-only'])
    
    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain('Script saved')
  })
})

describe('Generated Project Validation', () => {
  beforeEach(async () => {
    // Generate a fresh project for each test using new CLI structure
    await runCLI(['generate', '--config', 'tests/fixtures/test-enhanced.json'])
  })

  test('generates correct README content', () => {
    const readme = readFileSync('output/web_app/README.md', 'utf-8')
    
    expect(readme).toContain('WEB APP Starter')
    expect(readme).toContain('**Frontend**: react')
    expect(readme).toContain('**Backend**: node (express)')
    expect(readme).toContain('**Database**: postgresql')
    expect(readme).toContain('**Authentication**: auth0')
  })

  test('generates correct package.json', () => {
    const pkg = JSON.parse(readFileSync('output/web_app/package.json', 'utf-8'))
    
    expect(pkg.name).toBe('starterforge-backend')
    expect(pkg.dependencies.express).toBeDefined()
    expect(pkg.scripts.start).toBe('node src/index.js')
  })

  test('generates correct Express server', () => {
    const server = readFileSync('output/web_app/src/index.js', 'utf-8')
    
    expect(server).toContain('const express = require(\'express\')')
    expect(server).toContain('app.listen(3000')
    expect(server).toContain('Hello from Express')
  })

  test('generates database schema', () => {
    const schema = readFileSync('output/web_app/database/schema.prisma', 'utf-8')
    
    expect(schema).toContain('generator client')
    expect(schema).toContain('provider = "postgresql"')
    expect(schema).toContain('model User')
    expect(schema).toContain('model post')
    expect(schema).toContain('model comment')
  })

  test('generates auth configuration', () => {
    expect(existsSync('output/web_app/auth/auth0-config.js')).toBe(true)
    expect(existsSync('output/web_app/auth/LoginButton.tsx')).toBe(true)
    expect(existsSync('output/web_app/auth/middleware.js')).toBe(true)
    
    const authConfig = readFileSync('output/web_app/auth/auth0-config.js', 'utf-8')
    expect(authConfig).toContain('AUTH0_DOMAIN')
    expect(authConfig).toContain('AUTH0_CLIENT_ID')
  })

  test('generates environment file', () => {
    const env = readFileSync('output/web_app/.env.example', 'utf-8')
    
    expect(env).toContain('DATABASE_URL=postgresql://')
    expect(env).toContain('AUTH0_DOMAIN=')
    expect(env).toContain('PORT=3000')
    expect(env).toContain('NODE_ENV=development')
  })
})