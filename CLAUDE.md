# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

StarterForge is a CLI tool that generates customized project scaffolds based on JSON configuration files. The tool takes user selections for frontend, backend, database, auth, deployment, and optional features to create starter project templates with boilerplate code, configuration files, and setup scripts.

## Core Architecture

The project consists of three main components:

1. **Configuration Schema** (`starterforge.config.schema.ts`) - Zod-based validation schema defining the structure for project configurations
2. **CLI Tool** (`starterforge-cli.mjs`) - Node.js CLI that processes config files and generates project scaffolds
3. **Requirements Specification** (`STARTERFORGE_REQUIREMENTS.md`) - Comprehensive specification for the 8-step wizard flow

### Configuration System

The config schema supports:
- Project types: web_app, frontend_only, backend_only, cli_tool, browser_extension, microservice, custom
- Frontend frameworks with UI library selections
- Backend languages/frameworks with feature toggles
- Database engines with ORM choices
- Authentication providers with optional features
- DevOps/deployment configurations
- Optional integrations and features

### Project Scaffold Generation

The CLI generates:
- Directory structure based on project type
- README.md with project configuration summary
- .env.example with placeholder environment variables
- Language-specific entry files (main.py, index.js, App.tsx)
- package.json for Node.js projects
- Executable scaffold.sh script for reproducible setup

## Development Commands

The CLI is executed directly with Node.js:

```bash
# Run the CLI tool with a config file
node starterforge-cli.mjs path/to/config.json

# The tool expects a JSON config file that validates against StarterForgeConfigSchema
# Generated scaffolds are output to ./output/<project_type>/
```

## Key Technical Details

- Built with ES modules (`.mjs` files)
- Uses Zod for runtime schema validation
- Generates both files and bash scripts for project setup
- Supports multiple project types with conditional logic
- Configuration-driven scaffold generation

## Project Status

Currently implements basic scaffold generation for the core project types. The full wizard UI and advanced features outlined in the requirements are planned for future development sprints.