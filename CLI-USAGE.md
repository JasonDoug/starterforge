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

### 1. Create a Configuration File

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

### 2. Generate Your Project

```bash
starterforge my-project.json
```

## CLI Commands

### Basic Usage
```bash
starterforge <config-file> [options]
```

### Available Options

- `--mode <mode>`: Choose output mode
  - `all` (default): Generate both files and bash script
  - `scaffold-only`: Generate files only
  - `script-only`: Generate bash script only

### Examples

```bash
# Generate full project
starterforge config.json

# Generate files only (no bash script)
starterforge config.json --mode scaffold-only

# Generate bash script only (no files)
starterforge config.json --mode script-only
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

For a visual wizard experience, use:

```bash
npm install starterforge
npx starterforge web
# Opens web wizard at http://localhost:3001
```

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