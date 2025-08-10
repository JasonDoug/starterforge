import { test, expect, describe } from 'vitest'
import { StarterForgeConfigSchema } from '../starterforge.config.schema.js'

describe('Configuration Schema Validation', () => {
  test('validates minimal valid configuration', () => {
    const validConfig = {
      project_type: 'web_app',
      output: { format: ['zip'] }
    }
    
    expect(() => StarterForgeConfigSchema.parse(validConfig)).not.toThrow()
  })

  test('validates complete configuration', () => {
    const fullConfig = {
      project_type: 'web_app',
      frontend: {
        framework: 'react',
        ui_libraries: ['tailwindcss', 'shadcn']
      },
      backend: {
        language: 'node',
        framework: 'express'
      },
      database: {
        engines: ['postgresql'],
        orm: 'prisma',
        models: ['user', 'post']
      },
      auth: {
        provider: 'auth0',
        include_ui: true
      },
      devops: {
        deployment_targets: ['vercel'],
        ci_cd: true,
        docker: {
          enabled: true,
          compose: false
        }
      },
      optional_features: [
        {
          feature: 'api_docs',
          tool: 'swagger',
          include_demo: false
        }
      ],
      output: {
        format: ['zip']
      }
    }
    
    expect(() => StarterForgeConfigSchema.parse(fullConfig)).not.toThrow()
  })

  test('rejects invalid project type', () => {
    const invalidConfig = {
      project_type: 'invalid_type',
      output: { format: ['zip'] }
    }
    
    expect(() => StarterForgeConfigSchema.parse(invalidConfig)).toThrow()
  })

  test('requires output format', () => {
    const configWithoutOutput = {
      project_type: 'web_app'
    }
    
    expect(() => StarterForgeConfigSchema.parse(configWithoutOutput)).toThrow()
  })

  test('allows optional fields to be undefined', () => {
    const minimalConfig = {
      project_type: 'cli_tool',
      output: { format: ['zip'] }
    }
    
    const parsed = StarterForgeConfigSchema.parse(minimalConfig)
    expect(parsed.frontend).toBeUndefined()
    expect(parsed.database).toBeUndefined()
    expect(parsed.auth).toBeUndefined()
  })

  test('validates array fields correctly', () => {
    const config = {
      project_type: 'web_app',
      frontend: {
        framework: 'react',
        ui_libraries: ['tailwindcss', 'mui', 'bootstrap']
      },
      database: {
        engines: ['postgresql', 'redis']
      },
      output: { format: ['zip'] }
    }
    
    const parsed = StarterForgeConfigSchema.parse(config)
    expect(parsed.frontend.ui_libraries).toHaveLength(3)
    expect(parsed.database.engines).toHaveLength(2)
  })
})