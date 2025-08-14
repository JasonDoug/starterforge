function wizardApp() {
    return {
        currentStep: 1,
        stepTitles: [
            'Project Type',
            'Frontend Technology', 
            'Backend Technology',
            'Database & Storage',
            'Authentication',
            'Deployment & DevOps',
            'Optional Features',
            'Generate & Download'
        ],
        
        config: {
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
        },

        projectTypes: [
            {
                id: 'web_app',
                name: 'Web Application',
                description: 'Full-stack web application with frontend and backend'
            },
            {
                id: 'frontend_only',
                name: 'Frontend Only',
                description: 'Client-side application (SPA, static site)'
            },
            {
                id: 'backend_only', 
                name: 'Backend API',
                description: 'REST API or GraphQL backend service'
            },
            {
                id: 'cli_tool',
                name: 'CLI Tool',
                description: 'Command-line interface application'
            },
            {
                id: 'microservice',
                name: 'Microservice',
                description: 'Small, focused service for distributed architecture'
            },
            {
                id: 'browser_extension',
                name: 'Browser Extension',
                description: 'Browser extension for Chrome, Firefox, etc.'
            }
        ],

        frontendFrameworks: [
            { id: 'react', name: 'React' },
            { id: 'vue', name: 'Vue.js' },
            { id: 'svelte', name: 'Svelte' },
            { id: 'angular', name: 'Angular' },
            { id: 'nextjs', name: 'Next.js' },
            { id: 'nuxt', name: 'Nuxt.js' },
            { id: 'html', name: 'HTML/CSS/JS' },
            { id: 'none', name: 'None' }
        ],

        uiLibraries: [
            { id: 'tailwindcss', name: 'Tailwind CSS', hidden: false, recommended: false },
            { id: 'shadcn', name: 'shadcn/ui', hidden: false, recommended: false },
            { id: 'chakra', name: 'Chakra UI', hidden: false, recommended: false },
            { id: 'mui', name: 'Material-UI', hidden: false, recommended: false },
            { id: 'antd', name: 'Ant Design', hidden: false, recommended: false },
            { id: 'bootstrap', name: 'Bootstrap', hidden: false, recommended: false },
            { id: 'vuetify', name: 'Vuetify', hidden: false, recommended: false },
            { id: 'quasar', name: 'Quasar', hidden: false, recommended: false },
            { id: 'primeng', name: 'PrimeNG', hidden: false, recommended: false }
        ],

        backendOptions: [
            {
                id: 'node-express',
                language: 'node',
                framework: 'express',
                name: 'Node.js + Express',
                description: 'Fast, minimalist web framework for Node.js'
            },
            {
                id: 'node-fastify',
                language: 'node', 
                framework: 'fastify',
                name: 'Node.js + Fastify',
                description: 'Fast and low overhead web framework'
            },
            {
                id: 'python-fastapi',
                language: 'python',
                framework: 'fastapi',
                name: 'Python + FastAPI',
                description: 'Modern, fast web framework for building APIs'
            },
            {
                id: 'python-django',
                language: 'python',
                framework: 'django',
                name: 'Python + Django',
                description: 'High-level Python web framework'
            },
            {
                id: 'go-fiber',
                language: 'go',
                framework: 'fiber',
                name: 'Go + Fiber',
                description: 'Express-inspired web framework written in Go'
            },
            {
                id: 'rust-axum',
                language: 'rust',
                framework: 'axum',
                name: 'Rust + Axum',
                description: 'Ergonomic and modular web framework for Rust'
            }
        ],

        databases: [
            { id: 'postgresql', name: 'PostgreSQL' },
            { id: 'mysql', name: 'MySQL' },
            { id: 'sqlite', name: 'SQLite' },
            { id: 'mongodb', name: 'MongoDB' },
            { id: 'redis', name: 'Redis' },
            { id: 'none', name: 'None' }
        ],

        ormOptions: [
            { id: 'prisma', name: 'Prisma', hidden: false, recommended: false },
            { id: 'typeorm', name: 'TypeORM', hidden: false, recommended: false },
            { id: 'sequelize', name: 'Sequelize', hidden: false, recommended: false },
            { id: 'mongoose', name: 'Mongoose', hidden: false, recommended: false },
            { id: 'sqlalchemy', name: 'SQLAlchemy', hidden: false, recommended: false },
            { id: 'gorm', name: 'GORM', hidden: false, recommended: false }
        ],

        authProviders: [
            {
                id: 'none',
                name: 'No Authentication',
                description: 'Skip authentication setup',
                hidden: false,
                recommended: false
            },
            {
                id: 'auth0',
                name: 'Auth0',
                description: 'Complete authentication and authorization platform',
                hidden: false,
                recommended: false
            },
            {
                id: 'clerk',
                name: 'Clerk',
                description: 'Complete user management platform',
                hidden: false,
                recommended: false
            },
            {
                id: 'firebase',
                name: 'Firebase Auth',
                description: 'Google Firebase authentication service',
                hidden: false,
                recommended: false
            },
            {
                id: 'supabase',
                name: 'Supabase Auth',
                description: 'Open source Firebase alternative',
                hidden: false,
                recommended: false
            },
            {
                id: 'jwt',
                name: 'Custom JWT',
                description: 'Custom JSON Web Token implementation',
                hidden: false,
                recommended: false
            }
        ],

        deploymentPlatforms: [
            {
                id: 'vercel',
                name: 'Vercel',
                description: 'Frontend cloud platform with serverless functions'
            },
            {
                id: 'netlify',
                name: 'Netlify',
                description: 'All-in-one platform for modern web projects'
            },
            {
                id: 'railway',
                name: 'Railway',
                description: 'Infrastructure platform for full-stack applications'
            },
            {
                id: 'render',
                name: 'Render',
                description: 'Cloud platform for modern applications'
            },
            {
                id: 'aws',
                name: 'AWS',
                description: 'Amazon Web Services cloud platform'
            },
            {
                id: 'docker',
                name: 'Docker',
                description: 'Containerized deployment'
            }
        ],

        optionalFeatures: [
            {
                id: 'api_docs',
                name: 'API Documentation',
                description: 'Swagger/OpenAPI documentation',
                tool: 'swagger'
            },
            {
                id: 'admin_panel',
                name: 'Admin Panel',
                description: 'Administrative dashboard',
                tool: 'react-admin'
            },
            {
                id: 'stripe',
                name: 'Payments',
                description: 'Stripe payment integration',
                tool: 'stripe'
            },
            {
                id: 'analytics',
                name: 'Analytics',
                description: 'Google Analytics integration',
                tool: 'google-analytics'
            },
            {
                id: 'email',
                name: 'Email Service',
                description: 'Email sending capabilities',
                tool: 'sendgrid'
            },
            {
                id: 'ai_integration',
                name: 'AI/LLM Integration',
                description: 'OpenAI API integration',
                tool: 'openai'
            },
            {
                id: 'dark_mode',
                name: 'Dark Mode',
                description: 'Light/dark theme toggle',
                tool: 'theme'
            },
            {
                id: 'i18n',
                name: 'Internationalization',
                description: 'Multi-language support',
                tool: 'react-i18next'
            },
            {
                id: 'pwa',
                name: 'Progressive Web App',
                description: 'PWA configuration',
                tool: 'workbox'
            }
        ],

        // Methods
        selectProjectType(type) {
            this.config.project_type = type;
            
            // Auto-advance for simple selections
            setTimeout(() => {
                if (type === 'backend_only') {
                    this.config.frontend.framework = '';
                    this.config.frontend.ui_libraries = [];
                    this.currentStep = 3; // Skip frontend step
                } else if (type === 'cli_tool') {
                    this.config.frontend.framework = '';
                    this.config.frontend.ui_libraries = [];
                    this.currentStep = 3; // Skip frontend step
                }
            }, 500);
        },

        selectFrontendFramework(framework) {
            this.config.frontend.framework = framework;
            this.config.frontend.ui_libraries = []; // Reset UI libraries
            
            // Filter UI libraries based on selected framework
            this.filterUILibraries();
        },
        
        filterUILibraries() {
            const framework = this.config.frontend.framework;
            
            this.uiLibraries.forEach(library => {
                library.hidden = false;
                library.recommended = false;
                
                if (framework === 'react') {
                    // Hide Vue/Angular specific libraries
                    if (['vuetify', 'quasar', 'primeng'].includes(library.id)) {
                        library.hidden = true;
                    }
                    // Highlight recommended for React
                    if (['tailwindcss', 'shadcn'].includes(library.id)) {
                        library.recommended = true;
                    }
                } else if (framework === 'vue') {
                    // Hide React specific libraries
                    if (['shadcn', 'chakra'].includes(library.id)) {
                        library.hidden = true;
                    }
                    // Highlight recommended for Vue
                    if (['tailwindcss', 'vuetify'].includes(library.id)) {
                        library.recommended = true;
                    }
                } else if (framework === 'svelte') {
                    // Hide framework-specific libraries
                    if (['shadcn', 'chakra', 'vuetify', 'mui'].includes(library.id)) {
                        library.hidden = true;
                    }
                    // Highlight recommended for Svelte
                    if (['tailwindcss'].includes(library.id)) {
                        library.recommended = true;
                    }
                } else if (framework === 'angular') {
                    // Hide non-Angular libraries
                    if (['shadcn', 'chakra', 'vuetify'].includes(library.id)) {
                        library.hidden = true;
                    }
                    // Highlight recommended for Angular
                    if (['mui', 'tailwindcss'].includes(library.id)) {
                        library.recommended = true;
                    }
                }
            });
        },

        toggleUILibrary(library) {
            const libs = this.config.frontend.ui_libraries;
            const index = libs.indexOf(library);
            if (index > -1) {
                libs.splice(index, 1);
            } else {
                libs.push(library);
            }
        },

        selectBackend(backend) {
            this.config.backend.language = backend.language;
            this.config.backend.framework = backend.framework;
            
            // Filter ORMs based on backend language
            this.filterORMs();
        },
        
        filterORMs() {
            const language = this.config.backend.language;
            const hasDatabase = this.config.database.engines.length > 0 && !this.config.database.engines.includes('none');
            
            this.ormOptions.forEach(orm => {
                orm.hidden = false;
                orm.recommended = false;
                
                // Hide all ORMs if no database selected
                if (!hasDatabase) {
                    orm.hidden = true;
                    return;
                }
                
                if (language === 'node') {
                    // Hide non-JS ORMs
                    if (['sqlalchemy', 'gorm', 'diesel'].includes(orm.id)) {
                        orm.hidden = true;
                    }
                    // Highlight recommended for Node.js
                    if (['prisma'].includes(orm.id)) {
                        orm.recommended = true;
                    }
                } else if (language === 'python') {
                    // Hide non-Python ORMs
                    if (['prisma', 'typeorm', 'sequelize', 'gorm'].includes(orm.id)) {
                        orm.hidden = true;
                    }
                    // Highlight recommended for Python
                    if (['sqlalchemy'].includes(orm.id)) {
                        orm.recommended = true;
                    }
                } else if (language === 'go') {
                    // Hide non-Go ORMs
                    if (['prisma', 'typeorm', 'sqlalchemy', 'mongoose'].includes(orm.id)) {
                        orm.hidden = true;
                    }
                    // Highlight recommended for Go
                    if (['gorm'].includes(orm.id)) {
                        orm.recommended = true;
                    }
                }
            });
        },

        toggleDatabase(db) {
            const engines = this.config.database.engines;
            const index = engines.indexOf(db);
            if (index > -1) {
                engines.splice(index, 1);
            } else {
                engines.push(db);
            }
            
            // Reset ORM when database changes
            if (db === 'none') {
                this.config.database.engines = ['none'];
                this.config.database.orm = '';
            } else if (engines.includes('none')) {
                const noneIndex = engines.indexOf('none');
                engines.splice(noneIndex, 1);
            }
            
            // Filter ORMs and auth providers based on database selection
            setTimeout(() => {
                this.filterORMs();
                this.filterAuthProviders();
            }, 50);
        },

        selectORM(orm) {
            this.config.database.orm = orm;
        },

        selectAuthProvider(provider) {
            this.config.auth.provider = provider;
            if (provider === 'none') {
                this.config.auth.include_ui = false;
            }
        },
        
        filterAuthProviders() {
            const hasDatabase = this.config.database.engines.length > 0 && !this.config.database.engines.includes('none');
            const databaseEngine = this.config.database.engines[0];
            
            this.authProviders.forEach(auth => {
                auth.hidden = false;
                auth.recommended = false;
                
                if (!hasDatabase) {
                    // Without database, hide database-dependent auth
                    if (['supabase', 'custom-db'].includes(auth.id)) {
                        auth.hidden = true;
                    }
                    // Highlight recommended for no-database setups
                    if (['auth0', 'clerk'].includes(auth.id)) {
                        auth.recommended = true;
                    }
                } else {
                    // With database, show all options
                    if (databaseEngine === 'supabase') {
                        // Highlight Supabase auth for Supabase database
                        if (auth.id === 'supabase') {
                            auth.recommended = true;
                        }
                    } else if (databaseEngine === 'firebase') {
                        // Highlight Firebase auth for Firebase database
                        if (auth.id === 'firebase') {
                            auth.recommended = true;
                        }
                    } else {
                        // For other databases, highlight flexible options
                        if (['auth0', 'jwt'].includes(auth.id)) {
                            auth.recommended = true;
                        }
                    }
                }
            });
        },

        toggleDeploymentPlatform(platform) {
            const targets = this.config.devops.deployment_targets;
            const index = targets.indexOf(platform);
            if (index > -1) {
                targets.splice(index, 1);
            } else {
                targets.push(platform);
            }
        },

        toggleOptionalFeature(feature) {
            const features = this.config.optional_features;
            const existingIndex = features.findIndex(f => f.feature === feature.id);
            
            if (existingIndex > -1) {
                features.splice(existingIndex, 1);
            } else {
                features.push({
                    feature: feature.id,
                    tool: feature.tool,
                    include_demo: false
                });
            }
        },

        isFeatureSelected(featureId) {
            return this.config.optional_features.some(f => f.feature === featureId);
        },

        getProjectTypeName() {
            const projectType = this.projectTypes.find(p => p.id === this.config.project_type);
            return projectType ? projectType.name : this.config.project_type;
        },

        canProceed() {
            switch (this.currentStep) {
                case 1:
                    return this.config.project_type !== '';
                case 2:
                    // Skip frontend validation for backend-only projects
                    if (['backend_only', 'cli_tool'].includes(this.config.project_type)) {
                        return true;
                    }
                    return this.config.frontend.framework !== '';
                case 3:
                    return this.config.backend.language !== '' && this.config.backend.framework !== '';
                case 4:
                    return this.config.database.engines.length > 0;
                case 5:
                    return this.config.auth.provider !== '';
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
        },

        nextStep() {
            if (this.canProceed()) {
                if (this.currentStep === 8) {
                    this.generateProject();
                } else {
                    this.currentStep++;
                    
                    // Skip steps based on project type
                    if (this.currentStep === 2 && ['backend_only', 'cli_tool'].includes(this.config.project_type)) {
                        this.currentStep = 3;
                    }
                }
            }
        },

        previousStep() {
            if (this.currentStep > 1) {
                this.currentStep--;
                
                // Skip steps based on project type when going backwards
                if (this.currentStep === 2 && ['backend_only', 'cli_tool'].includes(this.config.project_type)) {
                    this.currentStep = 1;
                }
            }
        },

        async generateProject() {
            try {
                // Show loading state
                const button = document.querySelector('button[x-show="currentStep === 8"]');
                if (button) {
                    button.innerHTML = 'Generating...';
                    button.disabled = true;
                }

                // Send config to server
                const response = await fetch('/api/generate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.config)
                });

                if (response.ok) {
                    const result = await response.json();
                    
                    // Create download link
                    if (result.downloadUrl) {
                        window.location.href = result.downloadUrl;
                    } else if (result.message) {
                        alert('Project generated successfully!\n' + result.message);
                    }
                } else {
                    throw new Error('Failed to generate project');
                }
            } catch (error) {
                console.error('Generation error:', error);
                alert('Error generating project: ' + error.message);
            }
        }
    };
}