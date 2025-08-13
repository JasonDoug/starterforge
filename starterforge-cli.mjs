#!/usr/bin/env node

import { Command } from 'commander';
import { StarterForgeConfigSchema } from './starterforge.config.schema.js';
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
    console.error("❌ Failed to load or validate config:", err.message);
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

function scaffoldProject(config, mode) {
  const baseDir = path.join(__dirname, 'output', config.project_type);
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

    console.log("✅ Files scaffolded in:", baseDir);
  }

  if (mode !== 'scaffold-only') {
    writeFileSafe(scriptPath, scriptLines.join("\n"));
    fs.chmodSync(scriptPath, 0o755);
    console.log("📜 Script saved as:", scriptPath);
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

program
  .name("starterforge")
  .description("CLI to generate starter templates")
  .argument("<config>", "Path to config JSON file")
  .option("--mode <mode>", "Choose output mode: scaffold-only | script-only | all", "all")
  .action((configPath, options) => {
    const config = loadConfig(configPath);
    scaffoldProject(config, options.mode);
  });

program.parse();