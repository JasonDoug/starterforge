// Shared wizard logic for both web interface and CLI
// This module contains the core logic for the 8-step project configuration wizard

export const stepTitles = [
    'Project Type',
    'Frontend Technology', 
    'Backend Technology',
    'Database & Storage',
    'Authentication',
    'Deployment & DevOps',
    'Optional Features',
    'Generate & Download'
];

export const projectTypes = [
    {
        id: 'web_app',
        name: 'Web Application',
        icon: 'web-app',
        description: 'Full-stack web application with frontend and backend'
    },
    {
        id: 'frontend_only',
        name: 'Frontend Only',
        icon: 'frontend',
        description: 'Client-side application (SPA, static site)'
    },
    {
        id: 'backend_only', 
        name: 'Backend API',
        icon: 'api',
        description: 'REST API or GraphQL backend service'
    },
    {
        id: 'cli_tool',
        name: 'CLI Tool',
        icon: 'terminal',
        description: 'Command-line interface application'
    },
    {
        id: 'microservice',
        name: 'Microservice',
        icon: 'microservice',
        description: 'Small, focused service for distributed architecture'
    },
    {
        id: 'browser_extension',
        name: 'Browser Extension',
        icon: 'browser-extension',
        description: 'Browser extension for Chrome, Firefox, etc.'
    }
];

export const frontendFrameworks = [
    { id: 'react', name: 'React', icon: 'react'},
    { id: 'vue', name: 'Vue.js', icon: 'vue'},
    { id: 'svelte', name: 'Svelte', icon: 'svelte'},
    { id: 'angular', name: 'Angular', icon: 'angular'},
    { id: 'nextjs', name: 'Next.js', icon: 'nextjs'},
    { id: 'nuxt', name: 'Nuxt.js', icon: 'nuxt'},
    { id: 'html', name: 'HTML/CSS/JS', icon: 'html'},
    { id: 'none', name: 'None', icon: 'none'}
];

export const uiLibraries = [
    { id: 'tailwindcss', name: 'Tailwind CSS', hidden: false, recommended: false },
    { id: 'shadcn', name: 'shadcn/ui', hidden: false, recommended: false },
    { id: 'chakra', name: 'Chakra UI', hidden: false, recommended: false },
    { id: 'mui', name: 'Material-UI', hidden: false, recommended: false },
    { id: 'antd', name: 'Ant Design', hidden: false, recommended: false },
    { id: 'bootstrap', name: 'Bootstrap', hidden: false, recommended: false },
    { id: 'vuetify', name: 'Vuetify', hidden: false, recommended: false },
    { id: 'quasar', name: 'Quasar', hidden: false, recommended: false },
    { id: 'primeng', name: 'PrimeNG', hidden: false, recommended: false }
];

export const backendOptions = [
    {
        id: 'node-express',
        language: 'node',
        framework: 'express',
        name: 'Node.js + Express',
        icon: 'nodejs',
        description: 'Fast, minimalist web framework for Node.js'
    },
    {
        id: 'node-fastify',
        language: 'node', 
        framework: 'fastify',
        name: 'Node.js + Fastify',
        icon: 'fastify',
        description: 'Fast and low overhead web framework'
    },
    {
        id: 'python-fastapi',
        language: 'python',
        framework: 'fastapi',
        name: 'Python + FastAPI',
        icon: 'python',
        description: 'Modern, fast web framework for building APIs'
    },
    {
        id: 'python-django',
        language: 'python',
        framework: 'django',
        name: 'Python + Django',
        icon: 'django',
        description: 'High-level Python web framework'
    },
    {
        id: 'go-fiber',
        language: 'go',
        framework: 'fiber',
        name: 'Go + Fiber',
        icon: 'go',
        description: 'Express-inspired web framework written in Go'
    },
    {
        id: 'rust-axum',
        language: 'rust',
        framework: 'axum',
        name: 'Rust + Axum',
        icon: 'rust',
        description: 'Ergonomic and modular web framework for Rust'
    }
];

export const databases = [
    { id: 'postgresql', name: 'PostgreSQL', icon: 'postgresql'},
    { id: 'mysql', name: 'MySQL', icon: 'mysql'},
    { id: 'sqlite', name: 'SQLite', icon: 'sqlite'},
    { id: 'mongodb', name: 'MongoDB', icon: 'mongodb'},
    { id: 'redis', name: 'Redis', icon: 'redis'},
    { id: 'none', name: 'None', icon: 'none'}
];

export const ormOptions = [
    { id: 'prisma', name: 'Prisma', icon: 'prisma', hidden: false, recommended: false },
    { id: 'typeorm', name: 'TypeORM', icon: 'typeorm', hidden: false, recommended: false },
    { id: 'sequelize', name: 'Sequelize', icon: 'sequelize', hidden: false, recommended: false },
    { id: 'mongoose', name: 'Mongoose', icon: 'mongoose', hidden: false, recommended: false },
    { id: 'sqlalchemy', name: 'SQLAlchemy', icon: 'sqlalchemy', hidden: false, recommended: false },
    { id: 'gorm', name: 'GORM', icon: 'gorm', hidden: false, recommended: false }
];

export const authProviders = [
    {
        id: 'none',
        name: 'No Authentication',
        icon: 'none',
        description: 'Skip authentication setup',
        hidden: false,
        recommended: false
    },
    {
        id: 'auth0',
        name: 'Auth0',
        icon: 'auth0',
        description: 'Complete authentication and authorization platform',
        hidden: false,
        recommended: false
    },
    {
        id: 'clerk',
        name: 'Clerk',
        icon: 'clerk',
        description: 'Complete user management platform',
        hidden: false,
        recommended: false
    },
    {
        id: 'firebase',
        name: 'Firebase Auth',
        icon: 'firebase',
        description: 'Google Firebase authentication service',
        hidden: false,
        recommended: false
    },
    {
        id: 'supabase',
        name: 'Supabase Auth',
        icon: 'supabase',
        description: 'Open source Firebase alternative',
        hidden: false,
        recommended: false
    },
    {
        id: 'jwt',
        name: 'Custom JWT',
        icon: 'jwt',
        description: 'Custom JSON Web Token implementation',
        hidden: false,
        recommended: false
    }
];

export const deploymentPlatforms = [
    {
        id: 'vercel',
        name: 'Vercel',
        icon: 'vercel',
        description: 'Frontend cloud platform with serverless functions'
    },
    {
        id: 'netlify',
        name: 'Netlify',
        icon: 'netlify',
        description: 'All-in-one platform for modern web projects'
    },
    {
        id: 'railway',
        name: 'Railway',
        icon: 'railway',
        description: 'Infrastructure platform for full-stack applications'
    },
    {
        id: 'render',
        name: 'Render',
        icon: 'render',
        description: 'Cloud platform for modern applications'
    },
    {
        id: 'aws',
        name: 'AWS',
        icon: 'aws',
        description: 'Amazon Web Services cloud platform'
    },
    {
        id: 'docker',
        name: 'Docker',
        icon: 'docker',
        description: 'Containerized deployment'
    }
];

export const optionalFeatures = [
    {
        id: 'api_docs',
        name: 'API Documentation',
        icon: 'api-docs',
        description: 'Swagger/OpenAPI documentation',
        tool: 'swagger'
    },
    {
        id: 'admin_panel',
        name: 'Admin Panel',
        icon: 'admin-panel',
        description: 'Administrative dashboard',
        tool: 'react-admin'
    },
    {
        id: 'stripe',
        name: 'Payments',
        icon: 'stripe',
        description: 'Stripe payment integration',
        tool: 'stripe'
    },
    {
        id: 'analytics',
        name: 'Analytics',
        icon: 'analytics',
        description: 'Google Analytics integration',
        tool: 'google-analytics'
    },
    {
        id: 'email',
        name: 'Email Service',
        icon: 'email',
        description: 'Email sending capabilities',
        tool: 'sendgrid'
    },
    {
        id: 'ai_integration',
        name: 'AI/LLM Integration',
        icon: 'ai',
        description: 'OpenAI API integration',
        tool: 'openai'
    },
    {
        id: 'dark_mode',
        name: 'Dark Mode',
        icon: 'dark-mode',
        description: 'Light/dark theme toggle',
        tool: 'theme'
    },
    {
        id: 'i18n',
        name: 'Internationalization',
        icon: 'i18n',
        description: 'Multi-language support',
        tool: 'react-i18next'
    },
    {
        id: 'pwa',
        name: 'Progressive Web App',
        icon: 'pwa',
        description: 'PWA configuration',
        tool: 'workbox'
    }
];

// Create default configuration structure
export function createDefaultConfig() {
    return {
        project_type: '',
        frontend: {
            framework: '',
            ui_libraries: []
        },
        backend: {
            language: '',
            framework: ''
        },
        database: {
            engines: [],
            orm: ''
        },
        auth: {
            provider: '',
            include_ui: false
        },
        devops: {
            deployment_targets: [],
            ci_cd: false,
            docker: {
                enabled: false,
                compose: false
            }
        },
        optional_features: [],
        output: {
            format: ['zip']
        }
    };
}

// Filtering logic
export function filterUILibraries(framework, libraries = uiLibraries) {
    return libraries.map(library => {
        const filtered = { ...library };
        filtered.hidden = false;
        filtered.recommended = false;
        
        if (framework === 'react') {
            // Hide Vue/Angular specific libraries
            if (['vuetify', 'quasar', 'primeng'].includes(library.id)) {
                filtered.hidden = true;
            }
            // Highlight recommended for React
            if (['tailwindcss', 'shadcn'].includes(library.id)) {
                filtered.recommended = true;
            }
        } else if (framework === 'vue') {
            // Hide React specific libraries
            if (['shadcn', 'chakra'].includes(library.id)) {
                filtered.hidden = true;
            }
            // Highlight recommended for Vue
            if (['tailwindcss', 'vuetify'].includes(library.id)) {
                filtered.recommended = true;
            }
        } else if (framework === 'svelte') {
            // Hide framework-specific libraries
            if (['shadcn', 'chakra', 'vuetify', 'mui'].includes(library.id)) {
                filtered.hidden = true;
            }
            // Highlight recommended for Svelte
            if (['tailwindcss'].includes(library.id)) {
                filtered.recommended = true;
            }
        } else if (framework === 'angular') {
            // Hide non-Angular libraries
            if (['shadcn', 'chakra', 'vuetify'].includes(library.id)) {
                filtered.hidden = true;
            }
            // Highlight recommended for Angular
            if (['mui', 'tailwindcss'].includes(library.id)) {
                filtered.recommended = true;
            }
        }
        
        return filtered;
    });
}

export function filterORMs(backendLanguage, databaseEngines, orms = ormOptions) {
    const hasDatabase = databaseEngines.length > 0 && !databaseEngines.includes('none');
    
    return orms.map(orm => {
        const filtered = { ...orm };
        filtered.hidden = false;
        filtered.recommended = false;
        
        // Hide all ORMs if no database selected
        if (!hasDatabase) {
            filtered.hidden = true;
            return filtered;
        }
        
        if (backendLanguage === 'node') {
            // Hide non-JS ORMs
            if (['sqlalchemy', 'gorm', 'diesel'].includes(orm.id)) {
                filtered.hidden = true;
            }
            // Highlight recommended for Node.js
            if (['prisma'].includes(orm.id)) {
                filtered.recommended = true;
            }
        } else if (backendLanguage === 'python') {
            // Hide non-Python ORMs
            if (['prisma', 'typeorm', 'sequelize', 'gorm'].includes(orm.id)) {
                filtered.hidden = true;
            }
            // Highlight recommended for Python
            if (['sqlalchemy'].includes(orm.id)) {
                filtered.recommended = true;
            }
        } else if (backendLanguage === 'go') {
            // Hide non-Go ORMs
            if (['prisma', 'typeorm', 'sqlalchemy', 'mongoose'].includes(orm.id)) {
                filtered.hidden = true;
            }
            // Highlight recommended for Go
            if (['gorm'].includes(orm.id)) {
                filtered.recommended = true;
            }
        }
        
        return filtered;
    });
}

export function filterAuthProviders(databaseEngines, providers = authProviders) {
    const hasDatabase = databaseEngines.length > 0 && !databaseEngines.includes('none');
    const databaseEngine = databaseEngines[0];
    
    return providers.map(auth => {
        const filtered = { ...auth };
        filtered.hidden = false;
        filtered.recommended = false;
        
        if (!hasDatabase) {
            // Without database, hide database-dependent auth
            if (['supabase', 'custom-db'].includes(auth.id)) {
                filtered.hidden = true;
            }
            // Highlight recommended for no-database setups
            if (['auth0', 'clerk'].includes(auth.id)) {
                filtered.recommended = true;
            }
        } else {
            // With database, show all options
            if (databaseEngine === 'supabase') {
                // Highlight Supabase auth for Supabase database
                if (auth.id === 'supabase') {
                    filtered.recommended = true;
                }
            } else if (databaseEngine === 'firebase') {
                // Highlight Firebase auth for Firebase database
                if (auth.id === 'firebase') {
                    filtered.recommended = true;
                }
            } else {
                // For other databases, highlight flexible options
                if (['auth0', 'jwt'].includes(auth.id)) {
                    filtered.recommended = true;
                }
            }
        }
        
        return filtered;
    });
}

// Validation logic
export function canProceedFromStep(step, config) {
    switch (step) {
        case 1:
            return config.project_type !== '';
        case 2:
            // Skip frontend validation for backend-only projects
            if (['backend_only', 'cli_tool'].includes(config.project_type)) {
                return true;
            }
            return config.frontend.framework !== '';
        case 3:
            return config.backend.language !== '' && config.backend.framework !== '';
        case 4:
            return config.database.engines.length > 0;
        case 5:
            return config.auth.provider !== '';
        case 6:
            // DevOps step is optional - can always proceed
            return true;
        case 7:
            // Optional features step is optional - can always proceed
            return true;
        case 8:
            // Final step - always ready to generate
            return true;
        default:
            return true;
    }
}

// Step skipping logic
export function shouldSkipStep(step, projectType) {
    if (step === 2 && ['backend_only', 'cli_tool'].includes(projectType)) {
        return true; // Skip frontend step
    }
    return false;
}

// Get next step considering skips
export function getNextStep(currentStep, projectType) {
    let nextStep = currentStep + 1;
    
    // Skip steps based on project type
    if (nextStep === 2 && ['backend_only', 'cli_tool'].includes(projectType)) {
        nextStep = 3;
    }
    
    return nextStep <= 8 ? nextStep : 8;
}

// Get previous step considering skips
export function getPreviousStep(currentStep, projectType) {
    let prevStep = currentStep - 1;
    
    // Skip steps based on project type when going backwards
    if (prevStep === 2 && ['backend_only', 'cli_tool'].includes(projectType)) {
        prevStep = 1;
    }
    
    return prevStep >= 1 ? prevStep : 1;
}