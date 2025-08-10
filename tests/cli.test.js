import { test, expect, describe, beforeEach } from 'vitest'
import { spawn } from 'child_process'
import { readFileSync, existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.join(__dirname, '..')
const cliPath = path.join(projectRoot, 'starterforge-cli.mjs')

// Helper function to run CLI
async function runCLI(configFile, options = []) {
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

describe('StarterForge CLI', () => {
  test('shows help when called with --help', async () => {
    const result = await runCLI('--help')
    expect(result.stdout).toContain('CLI to generate starter templates')
    expect(result.stdout).toContain('Usage:')
  })

  test('generates web_app project successfully', async () => {
    const result = await runCLI('test-config.json')
    
    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain('✅ Files scaffolded')
    expect(result.stdout).toContain('📜 Script saved')
    
    // Check files were created
    expect(existsSync('output/web_app/README.md')).toBe(true)
    expect(existsSync('output/web_app/package.json')).toBe(true)
    expect(existsSync('output/web_app/scaffold.sh')).toBe(true)
  })

  test('generates CLI tool project', async () => {
    const result = await runCLI('test-cli.json')
    
    expect(result.exitCode).toBe(0)
    expect(existsSync('output/cli_tool/src/cli.py')).toBe(true)
    expect(existsSync('output/cli_tool/requirements.txt')).toBe(true)
  })

  test('handles script-only mode', async () => {
    const result = await runCLI('test-config.json', ['--mode', 'script-only'])
    
    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain('📜 Script saved')
    expect(result.stdout).not.toContain('✅ Files scaffolded')
  })

  test('handles scaffold-only mode', async () => {
    const result = await runCLI('test-config.json', ['--mode', 'scaffold-only'])
    
    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain('✅ Files scaffolded')
    expect(result.stdout).not.toContain('📜 Script saved')
  })

  test('fails with invalid config file', async () => {
    const result = await runCLI('nonexistent-config.json')
    
    expect(result.exitCode).toBe(1)
    expect(result.stderr).toContain('Failed to load')
  })
})

describe('Generated Project Validation', () => {
  beforeEach(async () => {
    // Generate a fresh project for each test
    await runCLI('test-enhanced.json')
  })

  test('generates correct README content', () => {
    const readme = readFileSync('output/web_app/README.md', 'utf-8')
    
    expect(readme).toContain('WEB APP Starter')
    expect(readme).toContain('Frontend: react')
    expect(readme).toContain('Backend: node (express)')
    expect(readme).toContain('Database: postgresql')
    expect(readme).toContain('Authentication: auth0')
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