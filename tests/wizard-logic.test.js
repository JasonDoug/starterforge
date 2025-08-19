import { test, expect, describe } from 'vitest'
import { 
  projectTypes,
  frontendFrameworks,
  backendOptions,
  databases,
  ormOptions,
  authProviders,
  createDefaultConfig,
  filterUILibraries,
  filterORMs,
  filterAuthProviders,
  canProceedFromStep,
  getNextStep,
  getPreviousStep
} from '../wizard-logic.js'

describe('Wizard Logic - Data Structure', () => {
  test('has all required project types', () => {
    const expectedTypes = ['web_app', 'frontend_only', 'backend_only', 'cli_tool', 'microservice', 'browser_extension']
    const actualTypes = projectTypes.map(t => t.id)
    
    expectedTypes.forEach(type => {
      expect(actualTypes).toContain(type)
    })
  })

  test('has all required frontend frameworks', () => {
    const expectedFrameworks = ['react', 'vue', 'svelte', 'angular', 'nextjs', 'nuxt', 'html', 'none']
    const actualFrameworks = frontendFrameworks.map(f => f.id)
    
    expectedFrameworks.forEach(framework => {
      expect(actualFrameworks).toContain(framework)
    })
  })

  test('has all required backend options', () => {
    expect(backendOptions.length).toBeGreaterThan(4)
    expect(backendOptions.find(b => b.language === 'node')).toBeDefined()
    expect(backendOptions.find(b => b.language === 'python')).toBeDefined()
    expect(backendOptions.find(b => b.language === 'go')).toBeDefined()
    expect(backendOptions.find(b => b.language === 'rust')).toBeDefined()
  })

  test('has all required databases', () => {
    const expectedDbs = ['postgresql', 'mysql', 'sqlite', 'mongodb', 'redis', 'none']
    const actualDbs = databases.map(d => d.id)
    
    expectedDbs.forEach(db => {
      expect(actualDbs).toContain(db)
    })
  })
})

describe('Wizard Logic - Configuration', () => {
  test('creates default config with correct structure', () => {
    const config = createDefaultConfig()
    
    expect(config).toHaveProperty('project_type', '')
    expect(config).toHaveProperty('frontend')
    expect(config.frontend).toHaveProperty('framework', '')
    expect(config.frontend).toHaveProperty('ui_libraries', [])
    expect(config).toHaveProperty('backend')
    expect(config.backend).toHaveProperty('language', '')
    expect(config.backend).toHaveProperty('framework', '')
    expect(config).toHaveProperty('database')
    expect(config.database).toHaveProperty('engines', [])
    expect(config.database).toHaveProperty('orm', '')
    expect(config).toHaveProperty('auth')
    expect(config.auth).toHaveProperty('provider', '')
    expect(config.auth).toHaveProperty('include_ui', false)
    expect(config).toHaveProperty('devops')
    expect(config).toHaveProperty('optional_features', [])
    expect(config).toHaveProperty('output')
  })
})

describe('Wizard Logic - Filtering', () => {
  test('filters UI libraries for React', () => {
    const filtered = filterUILibraries('react')
    
    // Should hide Vue/Angular specific libraries
    const vuetify = filtered.find(lib => lib.id === 'vuetify')
    const quasar = filtered.find(lib => lib.id === 'quasar')
    const primeng = filtered.find(lib => lib.id === 'primeng')
    
    expect(vuetify?.hidden).toBe(true)
    expect(quasar?.hidden).toBe(true)
    expect(primeng?.hidden).toBe(true)
    
    // Should recommend React-compatible libraries
    const tailwind = filtered.find(lib => lib.id === 'tailwindcss')
    const shadcn = filtered.find(lib => lib.id === 'shadcn')
    
    expect(tailwind?.recommended).toBe(true)
    expect(shadcn?.recommended).toBe(true)
  })

  test('filters UI libraries for Vue', () => {
    const filtered = filterUILibraries('vue')
    
    // Should hide React specific libraries
    const shadcn = filtered.find(lib => lib.id === 'shadcn')
    const chakra = filtered.find(lib => lib.id === 'chakra')
    
    expect(shadcn?.hidden).toBe(true)
    expect(chakra?.hidden).toBe(true)
    
    // Should recommend Vue-compatible libraries
    const tailwind = filtered.find(lib => lib.id === 'tailwindcss')
    const vuetify = filtered.find(lib => lib.id === 'vuetify')
    
    expect(tailwind?.recommended).toBe(true)
    expect(vuetify?.recommended).toBe(true)
  })

  test('filters ORMs based on backend language', () => {
    const nodeORMs = filterORMs('node', ['postgresql'])
    const pythonORMs = filterORMs('python', ['postgresql'])
    const goORMs = filterORMs('go', ['postgresql'])
    
    // Node.js should hide non-JS ORMs
    const sqlAlchemy = nodeORMs.find(orm => orm.id === 'sqlalchemy')
    const gorm = nodeORMs.find(orm => orm.id === 'gorm')
    expect(sqlAlchemy?.hidden).toBe(true)
    expect(gorm?.hidden).toBe(true)
    
    // Should recommend Prisma for Node.js
    const prisma = nodeORMs.find(orm => orm.id === 'prisma')
    expect(prisma?.recommended).toBe(true)
    
    // Python should hide non-Python ORMs
    const prismaForPython = pythonORMs.find(orm => orm.id === 'prisma')
    const typeorm = pythonORMs.find(orm => orm.id === 'typeorm')
    expect(prismaForPython?.hidden).toBe(true)
    expect(typeorm?.hidden).toBe(true)
    
    // Should recommend SQLAlchemy for Python
    const sqlAlchemyForPython = pythonORMs.find(orm => orm.id === 'sqlalchemy')
    expect(sqlAlchemyForPython?.recommended).toBe(true)
    
    // Go should hide non-Go ORMs
    const prismaForGo = goORMs.find(orm => orm.id === 'prisma')
    expect(prismaForGo?.hidden).toBe(true)
    
    // Should recommend GORM for Go
    const gormForGo = goORMs.find(orm => orm.id === 'gorm')
    expect(gormForGo?.recommended).toBe(true)
  })

  test('hides all ORMs when no database selected', () => {
    const noDbORMs = filterORMs('node', ['none'])
    const emptyDbORMs = filterORMs('node', [])
    
    noDbORMs.forEach(orm => {
      expect(orm.hidden).toBe(true)
    })
    
    emptyDbORMs.forEach(orm => {
      expect(orm.hidden).toBe(true)
    })
  })

  test('filters auth providers based on database selection', () => {
    const withoutDb = filterAuthProviders(['none'])
    const withDb = filterAuthProviders(['postgresql'])
    
    // Without database, should hide database-dependent auth
    const supabaseWithoutDb = withoutDb.find(auth => auth.id === 'supabase')
    expect(supabaseWithoutDb?.hidden).toBe(true)
    
    // Should recommend external auth providers when no database
    const auth0WithoutDb = withoutDb.find(auth => auth.id === 'auth0')
    const clerkWithoutDb = withoutDb.find(auth => auth.id === 'clerk')
    expect(auth0WithoutDb?.recommended).toBe(true)
    expect(clerkWithoutDb?.recommended).toBe(true)
    
    // With database, should show all options
    const supabaseWithDb = withDb.find(auth => auth.id === 'supabase')
    expect(supabaseWithDb?.hidden).toBe(false)
  })
})

describe('Wizard Logic - Step Navigation', () => {
  test('validates step completion correctly', () => {
    const config = createDefaultConfig()
    
    // Step 1: Project type required
    expect(canProceedFromStep(1, config)).toBe(false)
    config.project_type = 'web_app'
    expect(canProceedFromStep(1, config)).toBe(true)
    
    // Step 2: Frontend required for web apps
    expect(canProceedFromStep(2, config)).toBe(false)
    config.frontend.framework = 'react'
    expect(canProceedFromStep(2, config)).toBe(true)
    
    // Step 2: Frontend not required for backend-only
    config.project_type = 'backend_only'
    config.frontend.framework = ''
    expect(canProceedFromStep(2, config)).toBe(true)
    
    // Step 3: Backend required
    expect(canProceedFromStep(3, config)).toBe(false)
    config.backend.language = 'node'
    config.backend.framework = 'express'
    expect(canProceedFromStep(3, config)).toBe(true)
    
    // Step 4: Database required
    expect(canProceedFromStep(4, config)).toBe(false)
    config.database.engines = ['postgresql']
    expect(canProceedFromStep(4, config)).toBe(true)
    
    // Step 5: Auth required
    expect(canProceedFromStep(5, config)).toBe(false)
    config.auth.provider = 'auth0'
    expect(canProceedFromStep(5, config)).toBe(true)
    
    // Steps 6, 7, 8 are optional
    expect(canProceedFromStep(6, config)).toBe(true)
    expect(canProceedFromStep(7, config)).toBe(true)
    expect(canProceedFromStep(8, config)).toBe(true)
  })

  test('handles step navigation correctly', () => {
    // Normal progression
    expect(getNextStep(1, 'web_app')).toBe(2)
    expect(getNextStep(2, 'web_app')).toBe(3)
    expect(getNextStep(7, 'web_app')).toBe(8)
    expect(getNextStep(8, 'web_app')).toBe(8) // Can't go beyond step 8
    
    // Skip frontend for backend-only projects
    expect(getNextStep(1, 'backend_only')).toBe(3)
    expect(getNextStep(1, 'cli_tool')).toBe(3)
    
    // Previous step navigation
    expect(getPreviousStep(3, 'web_app')).toBe(2)
    expect(getPreviousStep(2, 'web_app')).toBe(1)
    expect(getPreviousStep(1, 'web_app')).toBe(1) // Can't go below step 1
    
    // Skip frontend when going backwards
    expect(getPreviousStep(3, 'backend_only')).toBe(1)
    expect(getPreviousStep(3, 'cli_tool')).toBe(1)
  })
})

describe('Wizard Logic - Data Integrity', () => {
  test('all project types have required properties', () => {
    projectTypes.forEach(type => {
      expect(type).toHaveProperty('id')
      expect(type).toHaveProperty('name')
      expect(type).toHaveProperty('icon')
      expect(type).toHaveProperty('description')
      expect(typeof type.id).toBe('string')
      expect(typeof type.name).toBe('string')
      expect(typeof type.icon).toBe('string')
      expect(typeof type.description).toBe('string')
    })
  })

  test('all backend options have required properties', () => {
    backendOptions.forEach(backend => {
      expect(backend).toHaveProperty('id')
      expect(backend).toHaveProperty('language')
      expect(backend).toHaveProperty('framework')
      expect(backend).toHaveProperty('name')
      expect(backend).toHaveProperty('icon')
      expect(backend).toHaveProperty('description')
    })
  })

  test('all auth providers have required properties', () => {
    authProviders.forEach(auth => {
      expect(auth).toHaveProperty('id')
      expect(auth).toHaveProperty('name')
      expect(auth).toHaveProperty('icon')
      expect(auth).toHaveProperty('description')
      expect(auth).toHaveProperty('hidden')
      expect(auth).toHaveProperty('recommended')
      expect(typeof auth.hidden).toBe('boolean')
      expect(typeof auth.recommended).toBe('boolean')
    })
  })
})