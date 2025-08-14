# StarterForge CLI Usage Guide

## Installation

### Global Installation (Recommended)
```bash
npm install -g starterforge
```

### Local Installation
```bash
npm install starterforge
npx starterforge --help
```

### From Source
```bash
git clone https://github.com/starterforge/starterforge.git
cd starterforge
npm install
npm link  # Creates global symlink
```

## Quick Start

### Option 1: Interactive Wizard (Recommended)

The easiest way to get started:

```bash
starterforge create --interactive
```

This launches an 8-step guided wizard that walks you through all configuration options with intelligent filtering and recommendations.

### Option 2: Configuration File

Create a JSON configuration file (e.g., `my-project.json`):

```json
{
  "project_type": "web_app",
  "frontend": {
    "framework": "react",
    "ui_libraries": ["tailwindcss"]
  },
  "backend": {
    "language": "node",
    "framework": "express"
  },
  "database": {
    "engines": ["postgresql"],
    "orm": "prisma"
  },
  "auth": {
    "provider": "auth0",
    "include_ui": true
  },
  "output": {
    "format": ["zip"]
  }
}
```

Then generate your project:

```bash
starterforge generate --config my-project.json
```

## CLI Commands

### Main Commands

```bash
starterforge --help                    # Show all available commands
starterforge create --interactive      # Launch interactive 8-step wizard  
starterforge generate --config <file>  # Generate from configuration file
starterforge list <type>               # List available options
```

### Generate Command

Generate project from configuration file:

```bash
starterforge generate --config <path> [options]
```

**Options:**
- `--config <path>`: Path to JSON configuration file (required)
- `--mode <mode>`: Output mode (default: "all")
  - `all`: Generate both files and bash script
  - `scaffold-only`: Generate files only
  - `script-only`: Generate bash script only
- `--output-dir <dir>`: Custom output directory (default: "output")

**Examples:**
```bash
# Generate full project
starterforge generate --config config.json

# Generate files only (no bash script)
starterforge generate --config config.json --mode scaffold-only

# Generate to custom directory
starterforge generate --config config.json --output-dir my-projects
```

### Interactive Create Command

Launch the interactive wizard:

```bash
starterforge create --interactive
```

The wizard guides you through 8 steps:
1. **Project Type** - Choose web app, CLI tool, etc.
2. **Frontend Technology** - Select framework and UI libraries
3. **Backend Technology** - Pick language and framework
4. **Database & Storage** - Configure data layer
5. **Authentication** - Set up user management
6. **Deployment & DevOps** - Configure hosting options
7. **Optional Features** - Add integrations
8. **Generate & Download** - Review and create project

### List Commands

Explore available options:

```bash
starterforge list frameworks    # List frontend frameworks
starterforge list databases     # List database engines  
starterforge list backends      # List backend options
starterforge list auth          # List authentication providers
starterforge list types         # List project types
```

### Backwards Compatibility

The old usage pattern still works:

```bash
starterforge config.json                    # Direct config file
starterforge config.json --mode script-only # With legacy options
```

## Configuration Schema

### Project Types
- `web_app` - Full-stack web application
- `frontend_only` - Client-side application
- `backend_only` - API server only
- `cli_tool` - Command-line application
- `microservice` - Microservice architecture
- `browser_extension` - Browser extension
- `custom` - Custom configuration

### Frontend Frameworks
- `react` - React.js
- `vue` - Vue.js
- `svelte` - Svelte
- `angular` - Angular
- `nextjs` - Next.js
- `nuxt` - Nuxt.js
- `html` - Plain HTML/CSS/JS

### UI Libraries
- `tailwindcss` - Tailwind CSS
- `shadcn` - shadcn/ui
- `chakra` - Chakra UI
- `mui` - Material-UI
- `antd` - Ant Design
- `bootstrap` - Bootstrap

### Backend Options

**Languages & Frameworks:**
- `node` + `express` - Node.js with Express
- `node` + `fastify` - Node.js with Fastify
- `python` + `fastapi` - Python with FastAPI
- `python` + `django` - Python with Django
- `go` + `fiber` - Go with Fiber
- `rust` + `axum` - Rust with Axum

### Database Options
- `postgresql` - PostgreSQL
- `mysql` - MySQL
- `sqlite` - SQLite
- `mongodb` - MongoDB
- `redis` - Redis

**ORMs:**
- `prisma` - Prisma ORM
- `typeorm` - TypeORM
- `sequelize` - Sequelize
- `mongoose` - Mongoose
- `sqlalchemy` - SQLAlchemy
- `gorm` - GORM

### Authentication Providers
- `none` - No authentication
- `auth0` - Auth0
- `clerk` - Clerk
- `firebase` - Firebase Auth
- `supabase` - Supabase Auth
- `jwt` - Custom JWT

### Deployment Platforms
- `vercel` - Vercel
- `netlify` - Netlify
- `railway` - Railway
- `render` - Render
- `aws` - AWS
- `docker` - Docker

## Complete Configuration Example

```json
{
  "project_type": "web_app",
  "frontend": {
    "framework": "react",
    "ui_libraries": ["tailwindcss", "shadcn"]
  },
  "backend": {
    "language": "python",
    "framework": "fastapi"
  },
  "database": {
    "engines": ["postgresql"],
    "orm": "prisma",
    "models": ["user", "post", "comment"]
  },
  "auth": {
    "provider": "auth0",
    "include_ui": true
  },
  "devops": {
    "deployment_targets": ["vercel", "railway"],
    "ci_cd": true,
    "docker": {
      "enabled": true,
      "compose": true
    }
  },
  "optional_features": [
    {
      "feature": "api_docs",
      "tool": "swagger",
      "include_demo": true
    },
    {
      "feature": "stripe",
      "tool": "stripe",
      "include_demo": false
    }
  ],
  "output": {
    "format": ["zip"]
  }
}
```

## Generated Output

StarterForge generates projects in `./output/<project_type>/` with:

### Files Generated
- **README.md** - Project documentation
- **.env.example** - Environment variables template
- **package.json** - Dependencies and scripts (Node.js projects)
- **requirements.txt** - Python dependencies (Python projects)
- **src/** - Source code directory
- **frontend/** - Frontend application files
- **database/** - Database schemas and migrations
- **auth/** - Authentication configuration and components

### Scripts Generated  
- **scaffold.sh** - Executable setup script for reproducible deployment

## Web Interface

For a visual wizard experience, run the web server:

```bash
npm run web
# Opens web wizard at http://localhost:3001
```

The web interface provides the same 8-step wizard as the CLI interactive mode, but with a visual interface featuring:
- Real-time configuration preview
- Intelligent option filtering  
- Drag-and-drop interface elements
- Progress tracking
- Visual project summaries

## Troubleshooting

### Common Issues

**Permission Error:**
```bash
chmod +x starterforge-cli.mjs
```

**Module Not Found:**
```bash
npm install -g starterforge
# or
npm link  # if installed from source
```

**Config Validation Error:**
Check your JSON syntax and ensure all required fields are provided.

## Support

- **Documentation**: [GitHub README](https://github.com/starterforge/starterforge)
- **Issues**: [GitHub Issues](https://github.com/starterforge/starterforge/issues)
- **Web Wizard**: Run `starterforge web` for interactive configuration