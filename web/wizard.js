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
                icon: '🌐',
                description: 'Full-stack web application with frontend and backend'
            },
            {
                id: 'frontend_only',
                name: 'Frontend Only',
                icon: '💻',
                description: 'Client-side application (SPA, static site)'
            },
            {
                id: 'backend_only', 
                name: 'Backend API',
                icon: '⚡',
                description: 'REST API or GraphQL backend service'
            },
            {
                id: 'cli_tool',
                name: 'CLI Tool',
                icon: '⌨️',
                description: 'Command-line interface application'
            },
            {
                id: 'microservice',
                name: 'Microservice',
                icon: '🔧',
                description: 'Small, focused service for distributed architecture'
            },
            {
                id: 'browser_extension',
                name: 'Browser Extension',
                icon: '🧩',
                description: 'Browser extension for Chrome, Firefox, etc.'
            }
        ],

        frontendFrameworks: [
            { id: 'react', name: 'React', icon: '⚛️' },
            { id: 'vue', name: 'Vue.js', icon: '💚' },
            { id: 'svelte', name: 'Svelte', icon: '🧡' },
            { id: 'angular', name: 'Angular', icon: '🅰️' },
            { id: 'nextjs', name: 'Next.js', icon: '▲' },
            { id: 'nuxt', name: 'Nuxt.js', icon: '💚' },
            { id: 'html', name: 'HTML/CSS/JS', icon: '🌐' },
            { id: 'none', name: 'None', icon: '❌' }
        ],

        uiLibraries: [
            { id: 'tailwindcss', name: 'Tailwind CSS', icon: '🎨' },
            { id: 'shadcn', name: 'shadcn/ui', icon: '🎭' },
            { id: 'chakra', name: 'Chakra UI', icon: '⭐' },
            { id: 'mui', name: 'Material-UI', icon: '📦' },
            { id: 'antd', name: 'Ant Design', icon: '🐜' },
            { id: 'bootstrap', name: 'Bootstrap', icon: '🅱️' }
        ],

        backendOptions: [
            {
                id: 'node-express',
                language: 'node',
                framework: 'express',
                name: 'Node.js + Express',
                icon: '🟢',
                description: 'Fast, minimalist web framework for Node.js'
            },
            {
                id: 'node-fastify',
                language: 'node', 
                framework: 'fastify',
                name: 'Node.js + Fastify',
                icon: '⚡',
                description: 'Fast and low overhead web framework'
            },
            {
                id: 'python-fastapi',
                language: 'python',
                framework: 'fastapi',
                name: 'Python + FastAPI',
                icon: '🐍',
                description: 'Modern, fast web framework for building APIs'
            },
            {
                id: 'python-django',
                language: 'python',
                framework: 'django',
                name: 'Python + Django',
                icon: '🎸',
                description: 'High-level Python web framework'
            },
            {
                id: 'go-fiber',
                language: 'go',
                framework: 'fiber',
                name: 'Go + Fiber',
                icon: '🐹',
                description: 'Express-inspired web framework written in Go'
            },
            {
                id: 'rust-axum',
                language: 'rust',
                framework: 'axum',
                name: 'Rust + Axum',
                icon: '🦀',
                description: 'Ergonomic and modular web framework for Rust'
            }
        ],

        databases: [
            { id: 'postgresql', name: 'PostgreSQL', icon: '🐘' },
            { id: 'mysql', name: 'MySQL', icon: '🐬' },
            { id: 'sqlite', name: 'SQLite', icon: '💾' },
            { id: 'mongodb', name: 'MongoDB', icon: '🍃' },
            { id: 'redis', name: 'Redis', icon: '🔴' },
            { id: 'none', name: 'None', icon: '❌' }
        ],

        ormOptions: [
            { id: 'prisma', name: 'Prisma' },
            { id: 'typeorm', name: 'TypeORM' },
            { id: 'sequelize', name: 'Sequelize' },
            { id: 'mongoose', name: 'Mongoose' },
            { id: 'sqlalchemy', name: 'SQLAlchemy' },
            { id: 'gorm', name: 'GORM' }
        ],

        authProviders: [
            {
                id: 'none',
                name: 'No Authentication',
                icon: '❌',
                description: 'Skip authentication setup'
            },
            {
                id: 'auth0',
                name: 'Auth0',
                icon: '🔐',
                description: 'Complete authentication and authorization platform'
            },
            {
                id: 'clerk',
                name: 'Clerk',
                icon: '👤',
                description: 'Complete user management platform'
            },
            {
                id: 'firebase',
                name: 'Firebase Auth',
                icon: '🔥',
                description: 'Google Firebase authentication service'
            },
            {
                id: 'supabase',
                name: 'Supabase Auth',
                icon: '⚡',
                description: 'Open source Firebase alternative'
            },
            {
                id: 'jwt',
                name: 'Custom JWT',
                icon: '🎫',
                description: 'Custom JSON Web Token implementation'
            }
        ],

        deploymentPlatforms: [
            {
                id: 'vercel',
                name: 'Vercel',
                icon: '▲',
                description: 'Frontend cloud platform with serverless functions'
            },
            {
                id: 'netlify',
                name: 'Netlify',
                icon: '🌐',
                description: 'All-in-one platform for modern web projects'
            },
            {
                id: 'railway',
                name: 'Railway',
                icon: '🚂',
                description: 'Infrastructure platform for full-stack applications'
            },
            {
                id: 'render',
                name: 'Render',
                icon: '🎨',
                description: 'Cloud platform for modern applications'
            },
            {
                id: 'aws',
                name: 'AWS',
                icon: '☁️',
                description: 'Amazon Web Services cloud platform'
            },
            {
                id: 'docker',
                name: 'Docker',
                icon: '🐳',
                description: 'Containerized deployment'
            }
        ],

        optionalFeatures: [
            {
                id: 'api_docs',
                name: 'API Documentation',
                icon: '📚',
                description: 'Swagger/OpenAPI documentation',
                tool: 'swagger'
            },
            {
                id: 'admin_panel',
                name: 'Admin Panel',
                icon: '⚙️',
                description: 'Administrative dashboard',
                tool: 'react-admin'
            },
            {
                id: 'stripe',
                name: 'Payments',
                icon: '💳',
                description: 'Stripe payment integration',
                tool: 'stripe'
            },
            {
                id: 'analytics',
                name: 'Analytics',
                icon: '📊',
                description: 'Google Analytics integration',
                tool: 'google-analytics'
            },
            {
                id: 'email',
                name: 'Email Service',
                icon: '📧',
                description: 'Email sending capabilities',
                tool: 'sendgrid'
            },
            {
                id: 'ai_integration',
                name: 'AI/LLM Integration',
                icon: '🤖',
                description: 'OpenAI API integration',
                tool: 'openai'
            },
            {
                id: 'dark_mode',
                name: 'Dark Mode',
                icon: '🌙',
                description: 'Light/dark theme toggle',
                tool: 'theme'
            },
            {
                id: 'i18n',
                name: 'Internationalization',
                icon: '🌍',
                description: 'Multi-language support',
                tool: 'react-i18next'
            },
            {
                id: 'pwa',
                name: 'Progressive Web App',
                icon: '📱',
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