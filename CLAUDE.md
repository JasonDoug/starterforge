# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

StarterForge is a CLI tool that generates customized project scaffolds based on JSON configuration files. The tool processes user configurations through an 8-step wizard flow (defined in requirements) to create starter project templates with boilerplate code, configuration files, and setup scripts.

## Core Architecture

The project has a simple two-file architecture:

1. **Configuration Schema** (`starterforge.config.schema.ts`) - Zod-based validation schema defining the complete structure for project configurations including project types, frontend/backend frameworks, databases, auth providers, deployment targets, and optional features
2. **CLI Tool** (`starterforge-cli.mjs`) - Node.js CLI that validates JSON configs against the schema and generates project scaffolds with files and executable bash scripts

The `STARTERFORGE_REQUIREMENTS.md` contains the complete specification for the planned 8-step wizard UI flow, but only the CLI scaffold generator is currently implemented.

## Development Commands

```bash
# Run the CLI tool with a config file
node starterforge-cli.mjs path/to/config.json

# Available modes:
node starterforge-cli.mjs config.json --mode all          # Generate files + script (default)
node starterforge-cli.mjs config.json --mode scaffold-only # Generate files only
node starterforge-cli.mjs config.json --mode script-only   # Generate script only
```

## Key Technical Details

- **ES Modules**: Built with `.mjs` files and ES module imports
- **Schema Validation**: Uses Zod for runtime JSON config validation with TypeScript types
- **Dual Output**: Generates both actual project files AND executable bash scripts for reproducible setup
- **File Generation Strategy**: Uses conditional logic based on project_type and technology selections
- **Output Structure**: Creates scaffolds in `./output/<project_type>/` directory
- **Script Generation**: Creates executable `scaffold.sh` files with proper permissions (chmod 755)

## Configuration Schema Structure

The schema supports these main sections:
- `project_type`: Enum of web_app, frontend_only, backend_only, cli_tool, browser_extension, microservice, custom
- `frontend`: Framework selection (React, Vue, etc.) with UI libraries array
- `backend`: Language/framework selection with features array
- `database`: Engine selection with ORM and model options
- `auth`: Provider selection with feature toggles
- `devops`: Deployment targets with CI/CD and Docker options
- `optional_features`: Array of additional integrations
- `output`: Format preferences and repository settings

## Current Implementation Status

This is an early-stage CLI tool that generates basic scaffolds. The comprehensive wizard UI described in the README and requirements is aspirational - currently only the JSON config processing and basic file generation is implemented.