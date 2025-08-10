#!/usr/bin/env node

import { Command } from 'commander';
import { StarterForgeConfigSchema } from './starterforge.config.schema';
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

function generateScriptLines(config, baseDir) {
  const lines = [`#!/bin/bash`, `# Scaffold script for ${config.project_type}`, `mkdir -p ${baseDir}/src`];

  const readme = `# ${config.project_type} Starter\n\n## Frontend: ${config.frontend?.framework || "None"}\n## Backend: ${config.backend?.framework || "None"}`;
  lines.push(`echo "${readme}" > ${path.join(baseDir, 'README.md')}`);

  const env = `# Example env\nDB_URL=...\nAPI_KEY=...`;
  lines.push(`echo "${env}" > ${path.join(baseDir, '.env.example')}`);

  if (config.backend?.language === 'python') {
    lines.push(`echo "print('Hello from FastAPI scaffold')" > ${path.join(baseDir, 'src', 'main.py')}`);
  } else if (config.backend?.language === 'node') {
    const jsPath = path.join(baseDir, 'src', 'index.js');
    lines.push(`echo "console.log('Hello from Express scaffold');" > ${jsPath}`);
    const pkg = JSON.stringify({
      name: "starterforge-backend",
      version: "0.1.0",
      scripts: { start: "node src/index.js" }
    }, null, 2);
    lines.push(`echo '${pkg}' > ${path.join(baseDir, 'package.json')}`);
  }

  if (config.frontend?.framework) {
    const frontendDir = path.join(baseDir, 'frontend');
    lines.push(`mkdir -p ${frontendDir}`);
    lines.push(`echo "import React from 'react';\\nexport default function App() { return <div>Hello from ${config.frontend.framework}</div>; }" > ${path.join(frontendDir, 'App.tsx')}`);
  }

  return lines;
}

function scaffoldProject(config, mode) {
  const baseDir = path.join(__dirname, 'output', config.project_type);
  const scriptLines = generateScriptLines(config, baseDir);
  const scriptPath = path.join(baseDir, 'scaffold.sh');

  if (mode !== 'script-only') {
    fs.mkdirSync(baseDir, { recursive: true });

    writeFileSafe(path.join(baseDir, 'README.md'), `# ${config.project_type} Starter\n\n## Frontend: ${config.frontend?.framework || "None"}\n## Backend: ${config.backend?.framework || "None"}`);
    writeFileSafe(path.join(baseDir, '.env.example'), '# Example env\nDB_URL=...\nAPI_KEY=...');

    if (config.backend?.language === 'python') {
      writeFileSafe(path.join(baseDir, 'src', 'main.py'), 'print("Hello from FastAPI scaffold")');
    } else if (config.backend?.language === 'node') {
      writeFileSafe(path.join(baseDir, 'src', 'index.js'), 'console.log("Hello from Express scaffold");');
      writeFileSafe(path.join(baseDir, 'package.json'), JSON.stringify({
        name: "starterforge-backend",
        version: "0.1.0",
        scripts: { start: "node src/index.js" }
      }, null, 2));
    }

    if (config.frontend?.framework) {
      writeFileSafe(path.join(baseDir, 'frontend', 'App.tsx'), `
import React from 'react';
export default function App() {
  return <div>Hello from ${config.frontend.framework}</div>;
}`.trim());
    }

    console.log("✅ Files scaffolded in:", baseDir);
  }

  if (mode !== 'scaffold-only') {
    writeFileSafe(scriptPath, scriptLines.join("\n"));
    fs.chmodSync(scriptPath, 0o755);
    console.log("📜 Script saved as:", scriptPath);
  }
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