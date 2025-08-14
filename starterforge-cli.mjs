#!/usr/bin/env node

import { Command } from 'commander';
import { StarterForgeConfigSchema } from './starterforge.config.schema.js';
import { 
  projectTypes, 
  frontendFrameworks, 
  backendOptions, 
  databases, 
  ormOptions, 
  authProviders, 
  deploymentPlatforms, 
  optionalFeatures,
  createDefaultConfig,
  filterUILibraries,
  filterORMs,
  filterAuthProviders,
  canProceedFromStep,
  getNextStep,
  getPreviousStep,
  stepTitles
} from './wizard-logic.js';
import { input, select, checkbox, confirm } from '@inquirer/prompts';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const program = new Command();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadConfig(filePath) {
  try {
    const configRaw = fs.readFileSync(filePath, 'utf-8');
    const configJson = JSON.parse(configRaw);
    const config = StarterForgeConfigSchema.parse(configJson);
    return config;
  } catch (err) {
    console.error("Failed to load or validate config:", err.message);
    process.exit(1);
  }
}

function writeFileSafe(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function generateReadme(config) {
  return `# ${config.project_type.replace(/_/g, ' ').toUpperCase()} Starter

## Configuration
- **Project Type**: ${config.project_type}
- **Frontend**: ${config.frontend?.framework || "None"}
- **Backend**: ${config.backend?.language} (${config.backend?.framework || "default"})
- **Database**: ${config.database?.engines?.join(", ") || "None"}
- **Authentication**: ${config.auth?.provider || "None"}

## Setup Instructions
1. Install dependencies
2. Configure environment variables (.env.example → .env)
3. Run the application

## Generated with StarterForge
This project was scaffolded using StarterForge CLI.`;
}

function generateEnvFile(config) {
  const envVars = ["# Environment Configuration"];
  
  if (config.database?.engines?.length) {
    if (config.database.engines.includes("postgresql")) {
      envVars.push("DATABASE_URL=postgresql://user:password@localhost:5432/dbname");
    }
    if (config.database.engines.includes("mysql")) {
      envVars.push("DATABASE_URL=mysql://user:password@localhost:3306/dbname");
    }
    if (config.database.engines.includes("mongodb")) {
      envVars.push("MONGODB_URI=mongodb://localhost:27017/dbname");
    }
  }

  if (config.auth?.provider) {
    envVars.push("AUTH_SECRET=your-auth-secret-here");
    if (config.auth.provider === "auth0") {
      envVars.push("AUTH0_DOMAIN=your-domain.auth0.com");
      envVars.push("AUTH0_CLIENT_ID=your-client-id");
      envVars.push("AUTH0_CLIENT_SECRET=your-client-secret");
    }
  }

  envVars.push("PORT=3000");
  envVars.push("NODE_ENV=development");

  return envVars.join("\n");
}

function generateBackendScript(config, baseDir) {
  const lines = [];
  const { language, framework } = config.backend;

  switch (language) {
    case 'python':
      lines.push(`echo "from fastapi import FastAPI\\napp = FastAPI()\\n\\n@app.get('/')\\ndef root():\\n    return {'message': 'Hello from ${framework || 'FastAPI'}'}" > ${path.join(baseDir, 'src', 'main.py')}`);
      lines.push(`echo "fastapi\\nuvicorn" > ${path.join(baseDir, 'requirements.txt')}`);
      break;
      
    case 'node':
      if (framework === 'express') {
        lines.push(`echo "const express = require('express');\\nconst app = express();\\n\\napp.get('/', (req, res) => {\\n  res.json({ message: 'Hello from Express' });\\n});\\n\\napp.listen(3000);" > ${path.join(baseDir, 'src', 'index.js')}`);
      } else if (framework === 'fastify') {
        lines.push(`echo "const fastify = require('fastify')();\\n\\nfastify.get('/', async (request, reply) => {\\n  return { message: 'Hello from Fastify' };\\n});\\n\\nfastify.listen(3000);" > ${path.join(baseDir, 'src', 'index.js')}`);
      } else {
        lines.push(`echo "console.log('Hello from Node.js');" > ${path.join(baseDir, 'src', 'index.js')}`);
      }
      break;

    case 'go':
      lines.push(`echo "package main\\n\\nimport (\\"fmt\\"\\n\\"net/http\\")\\n\\nfunc main() {\\n\\thttp.HandleFunc(\\"/\\", func(w http.ResponseWriter, r *http.Request) {\\n\\t\\tfmt.Fprintf(w, \\"Hello from Go!\\")\\n\\t})\\n\\thttp.ListenAndServe(\\":8080\\", nil)\\n}" > ${path.join(baseDir, 'src', 'main.go')}`);
      lines.push(`echo "module starterforge-backend\\n\\ngo 1.21" > ${path.join(baseDir, 'go.mod')}`);
      break;

    case 'rust':
      lines.push(`echo "fn main() {\\n    println!(\\"Hello from Rust!\\");\\n}" > ${path.join(baseDir, 'src', 'main.rs')}`);
      lines.push(`echo "[package]\\nname = \\"starterforge-backend\\"\\nversion = \\"0.1.0\\"\\nedition = \\"2021\\"" > ${path.join(baseDir, 'Cargo.toml')}`);
      break;
  }

  return lines;
}

function generateFrontendScript(config, baseDir) {
  const lines = [];
  const { framework, ui_libraries } = config.frontend;
  const frontendDir = path.join(baseDir, 'frontend');

  lines.push(`mkdir -p ${frontendDir}`);

  switch (framework) {
    case 'react':
      lines.push(`echo "import React from 'react';\\n\\nexport default function App() {\\n  return (\\n    <div>\\n      <h1>Hello from React!</h1>\\n      ${ui_libraries?.includes('tailwindcss') ? '<p className=\\"text-blue-500\\">Styled with Tailwind CSS</p>' : ''}\\n    </div>\\n  );\\n}" > ${path.join(frontendDir, 'App.tsx')}`);
      break;

    case 'vue':
      lines.push(`echo "<template>\\n  <div>\\n    <h1>Hello from Vue!</h1>\\n    ${ui_libraries?.includes('tailwindcss') ? '<p class=\\"text-blue-500\\">Styled with Tailwind CSS</p>' : ''}\\n  </div>\\n</template>\\n\\n<script setup>\\n// Vue 3 Composition API\\n</script>" > ${path.join(frontendDir, 'App.vue')}`);
      break;

    case 'svelte':
      lines.push(`echo "<h1>Hello from Svelte!</h1>\\n${ui_libraries?.includes('tailwindcss') ? '<p class=\\"text-blue-500\\">Styled with Tailwind CSS</p>' : ''}" > ${path.join(frontendDir, 'App.svelte')}`);
      break;

    default:
      lines.push(`echo "<!DOCTYPE html>\\n<html>\\n<head>\\n  <title>StarterForge App</title>\\n</head>\\n<body>\\n  <h1>Hello from ${framework || 'HTML'}!</h1>\\n</body>\\n</html>" > ${path.join(frontendDir, 'index.html')}`);
  }

  return lines;
}

function generateProjectTypeScript(config, baseDir) {
  const lines = [];

  switch (config.project_type) {
    case 'cli_tool':
      if (config.backend?.language === 'python') {
        lines.push(`echo "#!/usr/bin/env python3\\nimport sys\\n\\ndef main():\\n    print('Hello from CLI tool!')\\n    print(f'Args: {sys.argv[1:]}')\\n\\nif __name__ == '__main__':\\n    main()" > ${path.join(baseDir, 'src', 'cli.py')}`);
      } else if (config.backend?.language === 'node') {
        lines.push(`echo "#!/usr/bin/env node\\nconsole.log('Hello from CLI tool!');\\nconsole.log('Args:', process.argv.slice(2));" > ${path.join(baseDir, 'src', 'cli.js')}`);
      }
      break;

    case 'microservice':
      lines.push(`echo "# Microservice Configuration\\nservice_name=starterforge-service\\nservice_port=3000" > ${path.join(baseDir, 'service.conf')}`);
      break;

    case 'browser_extension':
      lines.push(`mkdir -p ${path.join(baseDir, 'manifest')}`);
      lines.push(`echo "{\\"manifest_version\\": 3,\\"name\\": \\"StarterForge Extension\\",\\"version\\": \\"1.0\\",\\"description\\": \\"Generated browser extension\\"}" > ${path.join(baseDir, 'manifest', 'manifest.json')}`);
      break;
  }

  return lines;
}

function generateScriptLines(config, baseDir) {
  const lines = [`#!/bin/bash`, `# Scaffold script for ${config.project_type}`, `mkdir -p ${baseDir}/src`];

  const readme = generateReadme(config);
  lines.push(`echo "${readme.replace(/"/g, '\\"').replace(/\n/g, '\\n')}" > ${path.join(baseDir, 'README.md')}`);

  const env = generateEnvFile(config);
  lines.push(`echo "${env.replace(/\n/g, '\\n')}" > ${path.join(baseDir, '.env.example')}`);

  // Backend scaffolding
  if (config.backend) {
    const backendLines = generateBackendScript(config, baseDir);
    lines.push(...backendLines);
  }

  // Frontend scaffolding
  if (config.frontend) {
    const frontendLines = generateFrontendScript(config, baseDir);
    lines.push(...frontendLines);
  }

  // Project type specific scaffolding
  const typeSpecificLines = generateProjectTypeScript(config, baseDir);
  lines.push(...typeSpecificLines);

  return lines;
}

function scaffoldProject(config, mode, outputDir = 'output') {
  const baseDir = path.join(__dirname, outputDir, config.project_type);
  const scriptLines = generateScriptLines(config, baseDir);
  const scriptPath = path.join(baseDir, 'scaffold.sh');

  if (mode !== 'script-only') {
    fs.mkdirSync(baseDir, { recursive: true });

    // Generate core files
    writeFileSafe(path.join(baseDir, 'README.md'), generateReadme(config));
    writeFileSafe(path.join(baseDir, '.env.example'), generateEnvFile(config));

    // Generate backend files
    if (config.backend) {
      generateBackendFiles(config, baseDir);
    }

    // Generate frontend files
    if (config.frontend) {
      generateFrontendFiles(config, baseDir);
    }

    // Generate project type specific files
    generateProjectTypeFiles(config, baseDir);

    // Generate database scaffolding
    if (config.database) {
      generateDatabaseFiles(config, baseDir);
    }

    // Generate auth scaffolding
    if (config.auth) {
      generateAuthFiles(config, baseDir);
    }

    console.log("Files scaffolded in:", baseDir);
  }

  if (mode !== 'scaffold-only') {
    writeFileSafe(scriptPath, scriptLines.join("\n"));
    fs.chmodSync(scriptPath, 0o755);
    console.log("Script saved as:", scriptPath);
  }
}

function generateBackendFiles(config, baseDir) {
  const { language, framework } = config.backend;

  switch (language) {
    case 'python':
      writeFileSafe(path.join(baseDir, 'src', 'main.py'), `from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Hello from ${framework || 'FastAPI'}"}
`);
      writeFileSafe(path.join(baseDir, 'requirements.txt'), 'fastapi\nuvicorn');
      break;

    case 'node':
      if (framework === 'express') {
        writeFileSafe(path.join(baseDir, 'src', 'index.js'), `const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express' });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
`);
      } else if (framework === 'fastify') {
        writeFileSafe(path.join(baseDir, 'src', 'index.js'), `const fastify = require('fastify')();

fastify.get('/', async (request, reply) => {
  return { message: 'Hello from Fastify' };
});

fastify.listen(3000, (err, address) => {
  if (err) throw err;
  console.log('Server running on', address);
});
`);
      } else {
        writeFileSafe(path.join(baseDir, 'src', 'index.js'), 'console.log("Hello from Node.js");');
      }

      // Generate package.json
      const packageJson = {
        name: "starterforge-backend",
        version: "0.1.0",
        scripts: {
          start: "node src/index.js",
          dev: "nodemon src/index.js"
        },
        dependencies: framework === 'express' ? { express: "^4.18.0" } : 
                     framework === 'fastify' ? { fastify: "^4.0.0" } : {},
        devDependencies: {
          nodemon: "^3.0.0"
        }
      };
      writeFileSafe(path.join(baseDir, 'package.json'), JSON.stringify(packageJson, null, 2));
      break;

    case 'go':
      writeFileSafe(path.join(baseDir, 'src', 'main.go'), `package main

import (
    "fmt"
    "net/http"
)

func main() {
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintf(w, "Hello from Go!")
    })
    http.ListenAndServe(":8080", nil)
}
`);
      writeFileSafe(path.join(baseDir, 'go.mod'), `module starterforge-backend

go 1.21
`);
      break;

    case 'rust':
      writeFileSafe(path.join(baseDir, 'src', 'main.rs'), `fn main() {
    println!("Hello from Rust!");
}
`);
      writeFileSafe(path.join(baseDir, 'Cargo.toml'), `[package]
name = "starterforge-backend"
version = "0.1.0"
edition = "2021"
`);
      break;
  }
}

function generateFrontendFiles(config, baseDir) {
  const { framework, ui_libraries } = config.frontend;
  const frontendDir = path.join(baseDir, 'frontend');

  switch (framework) {
    case 'react':
      writeFileSafe(path.join(frontendDir, 'App.tsx'), `import React from 'react';

export default function App() {
  return (
    <div>
      <h1>Hello from React!</h1>
      ${ui_libraries?.includes('tailwindcss') ? '<p className="text-blue-500">Styled with Tailwind CSS</p>' : ''}
    </div>
  );
}
`);
      // Generate package.json for React
      const reactPackage = {
        name: "starterforge-frontend",
        version: "0.1.0",
        dependencies: {
          react: "^18.0.0",
          "react-dom": "^18.0.0"
        },
        devDependencies: {
          "@types/react": "^18.0.0",
          typescript: "^5.0.0"
        }
      };
      if (ui_libraries?.includes('tailwindcss')) {
        reactPackage.devDependencies.tailwindcss = '^3.0.0';
      }
      writeFileSafe(path.join(frontendDir, 'package.json'), JSON.stringify(reactPackage, null, 2));
      break;

    case 'vue':
      writeFileSafe(path.join(frontendDir, 'App.vue'), `<template>
  <div>
    <h1>Hello from Vue!</h1>
    ${ui_libraries?.includes('tailwindcss') ? '<p class="text-blue-500">Styled with Tailwind CSS</p>' : ''}
  </div>
</template>

<script setup>
// Vue 3 Composition API
</script>
`);
      break;

    case 'svelte':
      writeFileSafe(path.join(frontendDir, 'App.svelte'), `<h1>Hello from Svelte!</h1>
${ui_libraries?.includes('tailwindcss') ? '<p class="text-blue-500">Styled with Tailwind CSS</p>' : ''}
`);
      break;

    default:
      writeFileSafe(path.join(frontendDir, 'index.html'), `<!DOCTYPE html>
<html>
<head>
  <title>StarterForge App</title>
</head>
<body>
  <h1>Hello from ${framework || 'HTML'}!</h1>
</body>
</html>
`);
  }
}

function generateProjectTypeFiles(config, baseDir) {
  switch (config.project_type) {
    case 'cli_tool':
      if (config.backend?.language === 'python') {
        writeFileSafe(path.join(baseDir, 'src', 'cli.py'), `#!/usr/bin/env python3
import sys

def main():
    print('Hello from CLI tool!')
    print(f'Args: {sys.argv[1:]}')

if __name__ == '__main__':
    main()
`);
      } else if (config.backend?.language === 'node') {
        writeFileSafe(path.join(baseDir, 'src', 'cli.js'), `#!/usr/bin/env node
console.log('Hello from CLI tool!');
console.log('Args:', process.argv.slice(2));
`);
      }
      break;

    case 'microservice':
      writeFileSafe(path.join(baseDir, 'service.conf'), `# Microservice Configuration
service_name=starterforge-service
service_port=3000
`);
      break;

    case 'browser_extension':
      writeFileSafe(path.join(baseDir, 'manifest', 'manifest.json'), JSON.stringify({
        manifest_version: 3,
        name: "StarterForge Extension",
        version: "1.0",
        description: "Generated browser extension"
      }, null, 2));
      break;
  }
}

function generateDatabaseFiles(config, baseDir) {
  const { engines, orm, models } = config.database;
  const dbDir = path.join(baseDir, 'database');

  // Generate database configuration
  if (engines?.includes('postgresql')) {
    writeFileSafe(path.join(dbDir, 'postgres.sql'), `-- PostgreSQL Database Schema
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

${models?.map(model => `
CREATE TABLE IF NOT EXISTS ${model}s (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`).join('\n') || ''}
`);
  }

  if (engines?.includes('mongodb')) {
    writeFileSafe(path.join(dbDir, 'schemas.js'), `// MongoDB Schemas
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

${models?.map(model => `
const ${model}Schema = new mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});`).join('\n') || ''}

module.exports = {
  User: mongoose.model('User', userSchema)${models?.length ? ',' : ''}
  ${models?.map(model => `${model}: mongoose.model('${model}', ${model}Schema)`).join(',\n  ') || ''}
};
`);
  }

  // Generate ORM configuration
  if (orm === 'prisma') {
    writeFileSafe(path.join(dbDir, 'schema.prisma'), `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "${engines[0]}"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

${models?.map(model => `
model ${model} {
  id        Int      @id @default(autoincrement())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}`).join('\n') || ''}
`);
  }

  // Generate migration files
  writeFileSafe(path.join(dbDir, 'migrations', '001_initial.sql'), `-- Initial database migration
-- This file contains the initial database schema
-- Run this file against your database to set up the initial structure
`);
}

function generateAuthFiles(config, baseDir) {
  const { provider, include_ui } = config.auth;
  const authDir = path.join(baseDir, 'auth');

  if (provider === 'auth0') {
    writeFileSafe(path.join(authDir, 'auth0-config.js'), `// Auth0 Configuration
const auth0Config = {
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  redirectUri: process.env.AUTH0_REDIRECT_URI || 'http://localhost:3000/callback'
};

module.exports = auth0Config;
`);

    if (include_ui) {
      writeFileSafe(path.join(authDir, 'LoginButton.tsx'), `import React from 'react';

interface LoginButtonProps {
  onLogin: () => void;
}

export default function LoginButton({ onLogin }: LoginButtonProps) {
  return (
    <button 
      onClick={onLogin}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Login with Auth0
    </button>
  );
}
`);
    }
  }

  if (provider === 'jwt') {
    writeFileSafe(path.join(authDir, 'jwt-utils.js'), `const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

module.exports = { generateToken, verifyToken };
`);
  }

  // Generate auth middleware
  writeFileSafe(path.join(authDir, 'middleware.js'), `// Authentication Middleware
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // Token validation logic here
  // This depends on your auth provider
  
  next();
}

module.exports = { requireAuth };
`);
}

// Interactive wizard implementation
async function runInteractiveWizard() {
  const config = createDefaultConfig();
  
  try {
    // Step 1: Project Type
    console.log(`\nStep 1/8: ${stepTitles[0]}`);
    const projectType = await select({
      message: 'What type of project are you building?',
      choices: projectTypes.map(type => ({
        name: type.name,
        value: type.id,
        description: type.description
      }))
    });
    config.project_type = projectType;
    
    // Step 2: Frontend (skip for backend-only projects)
    if (!['backend_only', 'cli_tool'].includes(projectType)) {
      console.log(`\nStep 2/8: ${stepTitles[1]}`);
      const frontend = await select({
        message: 'Choose your frontend framework:',
        choices: frontendFrameworks.map(fw => ({
          name: fw.name,
          value: fw.id
        }))
      });
      config.frontend.framework = frontend;
      
      // UI Libraries (if frontend selected)
      if (frontend !== 'none') {
        const filteredLibraries = filterUILibraries(frontend);
        const availableLibraries = filteredLibraries.filter(lib => !lib.hidden);
        
        if (availableLibraries.length > 0) {
          const uiLibs = await checkbox({
            message: 'Select UI libraries (optional):',
            choices: availableLibraries.map(lib => ({
              name: `${lib.name}${lib.recommended ? '  Recommended' : ''}`,
              value: lib.id,
              checked: lib.recommended
            }))
          });
          config.frontend.ui_libraries = uiLibs;
        }
      }
    }
    
    // Step 3: Backend
    console.log(`\nStep 3/8: ${stepTitles[2]}`);
    const backend = await select({
      message: 'Choose your backend technology:',
      choices: backendOptions.map(backend => ({
        name: backend.name,
        value: backend.id,
        description: backend.description
      }))
    });
    
    const selectedBackend = backendOptions.find(b => b.id === backend);
    config.backend.language = selectedBackend.language;
    config.backend.framework = selectedBackend.framework;
    
    // Step 4: Database
    console.log(`\nStep 4/8: ${stepTitles[3]}`);
    const dbEngines = await checkbox({
      message: 'Select database engines:',
      choices: databases.map(db => ({
        name: db.name,
        value: db.id
      }))
    });
    config.database.engines = dbEngines;
    
    // ORM Selection (if database selected)
    if (dbEngines.length > 0 && !dbEngines.includes('none')) {
      const filteredORMs = filterORMs(selectedBackend.language, dbEngines);
      const availableORMs = filteredORMs.filter(orm => !orm.hidden);
      
      if (availableORMs.length > 0) {
        const orm = await select({
          message: 'Choose an ORM:',
          choices: [
            { name: 'Skip ORM', value: '' },
            ...availableORMs.map(orm => ({
              name: `${orm.name}${orm.recommended ? '  Recommended' : ''}`,
              value: orm.id
            }))
          ]
        });
        config.database.orm = orm;
      }
    }
    
    // Step 5: Authentication
    console.log(`\nStep 5/8: ${stepTitles[4]}`);
    const filteredAuth = filterAuthProviders(dbEngines);
    const availableAuth = filteredAuth.filter(auth => !auth.hidden);
    
    const authProvider = await select({
      message: 'Choose authentication provider:',
      choices: availableAuth.map(auth => ({
        name: `${auth.name}${auth.recommended ? '  Recommended' : ''}`,
        value: auth.id,
        description: auth.description
      }))
    });
    config.auth.provider = authProvider;
    
    // Include UI for auth
    if (authProvider !== 'none') {
      const includeUI = await confirm({
        message: 'Include pre-built UI components (login forms, buttons)?',
        default: true
      });
      config.auth.include_ui = includeUI;
    }
    
    // Step 6: Deployment
    console.log(`\nStep 6/8: ${stepTitles[5]}`);
    const deploymentTargets = await checkbox({
      message: 'Select deployment platforms (optional):',
      choices: deploymentPlatforms.map(platform => ({
        name: platform.name,
        value: platform.id,
        description: platform.description
      }))
    });
    config.devops.deployment_targets = deploymentTargets;
    
    // CI/CD and Docker options
    if (deploymentTargets.length > 0) {
      const cicd = await confirm({
        message: 'Include GitHub Actions CI/CD pipeline?',
        default: false
      });
      config.devops.ci_cd = cicd;
      
      const docker = await confirm({
        message: 'Include Docker configuration?',
        default: false
      });
      config.devops.docker.enabled = docker;
      
      if (docker) {
        const compose = await confirm({
          message: 'Include Docker Compose for development?',
          default: true
        });
        config.devops.docker.compose = compose;
      }
    }
    
    // Step 7: Optional Features
    console.log(`\nStep 7/8: ${stepTitles[6]}`);
    const features = await checkbox({
      message: 'Select optional features:',
      choices: optionalFeatures.map(feature => ({
        name: feature.name,
        value: feature.id,
        description: feature.description
      }))
    });
    
    config.optional_features = features.map(featureId => {
      const feature = optionalFeatures.find(f => f.id === featureId);
      return {
        feature: featureId,
        tool: feature.tool,
        include_demo: false
      };
    });
    
    // Step 8: Final confirmation
    console.log(`\nStep 8/8: ${stepTitles[7]}`);
    console.log("Configuration complete! Here's what we'll generate:");
    console.log(`   Project Type: ${config.project_type}`);
    if (config.frontend.framework) {
      console.log(`   Frontend: ${config.frontend.framework} ${config.frontend.ui_libraries.length ? `+ ${config.frontend.ui_libraries.join(', ')}` : ''}`);
    }
    console.log(`   Backend: ${config.backend.language} + ${config.backend.framework}`);
    if (config.database.engines.length > 0) {
      console.log(`   Database: ${config.database.engines.join(', ')}${config.database.orm ? ` + ${config.database.orm}` : ''}`);
    }
    console.log(`   Auth: ${config.auth.provider}`);
    if (config.devops.deployment_targets.length > 0) {
      console.log(`   Deployment: ${config.devops.deployment_targets.join(', ')}`);
    }
    if (config.optional_features.length > 0) {
      console.log(`   Features: ${config.optional_features.map(f => f.feature).join(', ')}`);
    }
    
    const proceed = await confirm({
      message: 'Generate this project?',
      default: true
    });
    
    if (!proceed) {
      console.log("Project generation cancelled.");
      process.exit(0);
    }
    
    return config;
    
  } catch (error) {
    if (error.name === 'ExitPromptError') {
      console.log("\nWizard cancelled by user.");
      process.exit(0);
    }
    throw error;
  }
}

// Configure main program
program
  .name("starterforge")
  .description("The Ultimate Project Scaffold Generator")
  .version("1.0.0");

// Generate command (from config file)
program
  .command("generate")
  .description("Generate project from configuration file")
  .option("--config <path>", "Path to config JSON file")
  .option("--mode <mode>", "Choose output mode: scaffold-only | script-only | all", "all")
  .option("--output-dir <dir>", "Custom output directory", "output")
  .action(async (options) => {
    if (!options.config) {
      console.error("Config file path is required. Use --config <path>");
      process.exit(1);
    }
    
    try {
      const config = loadConfig(options.config);
      console.log(`Generating ${config.project_type} project...`);
      await scaffoldProject(config, options.mode, options.outputDir);
      console.log("Project generated successfully!");
    } catch (error) {
      console.error("Generation failed:", error.message);
      process.exit(1);
    }
  });

// Interactive create command
program
  .command("create")
  .description("Create project with interactive wizard")
  .option("--interactive", "Launch interactive 8-step wizard", true)
  .option("--output-dir <dir>", "Custom output directory", "output")
  .action(async (options) => {
    try {
      console.log("Welcome to StarterForge Interactive Wizard!");
      console.log("Let's build your perfect project scaffold in 8 steps.\n");
      
      const config = await runInteractiveWizard();
      
      console.log("\nGenerating your project...");
      await scaffoldProject(config, "all", options.outputDir);
      console.log("Project generated successfully!");
      
      // Show summary
      console.log("\nProject Summary:");
      console.log(`   Type: ${config.project_type}`);
      if (config.frontend?.framework) {
        console.log(`   Frontend: ${config.frontend.framework}`);
      }
      if (config.backend?.language) {
        console.log(`   Backend: ${config.backend.language} + ${config.backend.framework}`);
      }
      if (config.database?.engines?.length > 0) {
        console.log(`   Database: ${config.database.engines.join(', ')}`);
      }
      
    } catch (error) {
      console.error("Wizard failed:", error.message);
      process.exit(1);
    }
  });

// List command for exploring options
const listCommand = program
  .command("list")
  .description("List available options");

listCommand
  .command("frameworks")
  .description("List available frontend frameworks")
  .action(() => {
    console.log("Available Frontend Frameworks:");
    frontendFrameworks.forEach(fw => {
      console.log(`   ${fw.name} (${fw.id})`);
    });
  });

listCommand
  .command("databases")
  .description("List available database engines")
  .action(() => {
    console.log("Available Databases:");
    databases.forEach(db => {
      console.log(`   ${db.name} (${db.id})`);
    });
  });

listCommand
  .command("backends")
  .description("List available backend options")
  .action(() => {
    console.log("Available Backend Options:");
    backendOptions.forEach(backend => {
      console.log(`   ${backend.name} - ${backend.description}`);
    });
  });

listCommand
  .command("auth")
  .description("List available authentication providers")
  .action(() => {
    console.log("Available Auth Providers:");
    authProviders.forEach(auth => {
      console.log(`   ${auth.name} - ${auth.description}`);
    });
  });

listCommand
  .command("types")
  .description("List available project types")
  .action(() => {
    console.log("Available Project Types:");
    projectTypes.forEach(type => {
      console.log(`   ${type.name} - ${type.description}`);
    });
  });

// Web command to start the web wizard
program
  .command("web")
  .description("Start the web wizard interface")
  .option("-p, --port <port>", "Port to run the web server on", "3001")
  .action(async (options) => {
    try {
      // Import and start the web server
      const { spawn } = await import('child_process');
      const webServerPath = path.join(__dirname, 'web-server.mjs');
      
      console.log(`Starting StarterForge web wizard on port ${options.port}...`);
      console.log(`Open your browser to: http://localhost:${options.port}`);
      
      const serverProcess = spawn('node', [webServerPath], {
        stdio: 'inherit',
        env: { ...process.env, PORT: options.port }
      });
      
      // Handle process termination
      process.on('SIGINT', () => {
        console.log('\nShutting down web server...');
        serverProcess.kill('SIGINT');
        process.exit(0);
      });
      
      serverProcess.on('error', (error) => {
        console.error('Failed to start web server:', error.message);
        process.exit(1);
      });
      
    } catch (error) {
      console.error('Failed to start web wizard:', error.message);
      console.error('Make sure you have the complete StarterForge package installed.');
      process.exit(1);
    }
  });

// For backwards compatibility - support old direct config file usage
const args = process.argv.slice(2);
if (args.length > 0 && !args[0].startsWith('-') && !['generate', 'create', 'list', 'web', 'help'].includes(args[0])) {
  // Legacy mode: starterforge config.json [--mode mode] [--output-dir dir]
  const configPath = args[0];
  let mode = "all";
  let outputDir = "output";
  
  // Parse legacy options
  for (let i = 1; i < args.length; i += 2) {
    if (args[i] === '--mode') {
      mode = args[i + 1] || "all";
    } else if (args[i] === '--output-dir') {
      outputDir = args[i + 1] || "output";
    }
  }
  
  try {
    const config = loadConfig(configPath);
    console.log(`Generating ${config.project_type} project from config file...`);
    await scaffoldProject(config, mode, outputDir);
    console.log("Project generated successfully!");
  } catch (error) {
    console.error("Generation failed:", error.message);
    process.exit(1);
  }
} else {
  program.parse();
}