import { test, expect, describe, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import express from 'express'
import { spawn } from 'child_process'
import { readFileSync } from 'fs'

// Import web server (we'll need to modify it to be importable)
// For now, test against running server

const TEST_PORT = 3002
const BASE_URL = `http://localhost:${TEST_PORT}`

let serverProcess

describe('Web API', () => {
  beforeAll(async () => {
    // Start server on test port
    serverProcess = spawn('node', ['web-server.mjs'], {
      env: { ...process.env, PORT: TEST_PORT },
      stdio: 'pipe'
    })

    // Wait for server to start
    await new Promise((resolve) => {
      serverProcess.stdout.on('data', (data) => {
        if (data.toString().includes('running at')) {
          resolve()
        }
      })
    })
  })

  afterAll(() => {
    if (serverProcess) {
      serverProcess.kill()
    }
  })

  test('GET /api/health returns success', async () => {
    const response = await fetch(`${BASE_URL}/api/health`)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.message).toContain('StarterForge API is running')
  })

  test('POST /api/generate with valid config', async () => {
    const testConfig = {
      project_type: 'web_app',
      frontend: { framework: 'react' },
      backend: { language: 'node', framework: 'express' },
      database: { engines: ['postgresql'] },
      auth: { provider: 'auth0' },
      output: { format: ['zip'] }
    }

    const response = await fetch(`${BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testConfig)
    })

    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.message).toContain('Project generated successfully')
    expect(data.outputPath).toBeDefined()
    expect(data.files).toBeDefined()
  })

  test('POST /api/generate with invalid config', async () => {
    const invalidConfig = {
      project_type: 'invalid_type'
    }

    const response = await fetch(`${BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidConfig)
    })

    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toContain('Invalid configuration')
  })

  test('GET / serves HTML wizard', async () => {
    const response = await fetch(`${BASE_URL}/`)
    const html = await response.text()
    
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('text/html')
    expect(html).toContain('StarterForge')
    expect(html).toContain('Project Scaffold Generator')
  })

  test('GET /api/preview/:projectType', async () => {
    // First generate a project
    const testConfig = {
      project_type: 'cli_tool',
      backend: { language: 'python' },
      output: { format: ['zip'] }
    }

    await fetch(`${BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testConfig)
    })

    // Then preview it
    const response = await fetch(`${BASE_URL}/api/preview/cli_tool`)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.structure).toBeDefined()
    expect(Array.isArray(data.structure)).toBe(true)
  })
})