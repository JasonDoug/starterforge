# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-01-14

### Added
- New `starterforge web` command to launch web wizard interface from CLI
- Support for custom port with `--port` option for web command
- Professional appearance with emoji removal across all interfaces
- MIT License file
- Contributing guidelines (CONTRIBUTING.md)
- Code of Conduct (CODE_OF_CONDUCT.md)
- GitHub Actions CI/CD workflows for automated testing and publishing
- Comprehensive test coverage with Vitest framework

### Changed
- Removed emojis from CLI output, web interface, and wizard logic for professional appearance
- Updated wizard-logic.js with cleaner data structures
- Improved error handling and user feedback messages
- Enhanced documentation structure and clarity

### Fixed
- CLI backwards compatibility check now includes 'web' command
- Web wizard interface displays properly without icon dependencies
- Consistent formatting across all configuration data structures

## [1.0.0] - 2025-01-13

### Added
- Initial release of StarterForge CLI tool
- Support for 6 project types: Web App, Frontend Only, Backend API, CLI Tool, Microservice, Browser Extension
- Interactive CLI wizard with `starterforge create` command
- Configuration file support with JSON schema validation
- Support for multiple frontend frameworks: React, Vue, Svelte, Angular, Next.js, Nuxt.js
- Support for multiple backend technologies: Node.js (Express/Fastify), Python (FastAPI/Django), Go (Fiber), Rust (Axum)
- Database support: PostgreSQL, MySQL, SQLite, MongoDB, Redis
- ORM integration: Prisma, TypeORM, Sequelize, Mongoose, SQLAlchemy, GORM
- Authentication providers: Auth0, Clerk, Firebase, Supabase, JWT, None
- Deployment platform configurations: Vercel, Netlify, Railway, Render, AWS, Docker
- Optional features: API docs, Admin panel, Payments, Analytics, Email, AI integration, Dark mode, i18n, PWA
- Web-based wizard interface with Express server
- Intelligent filtering system for framework-specific recommendations
- Comprehensive project scaffolding with working code examples
- Both file generation and executable script generation modes
- Complete test suite with multiple project type validation

### Technical Features
- ES Modules architecture with .mjs files
- Zod-based configuration schema validation
- Commander.js CLI framework
- Express.js web server with Alpine.js frontend
- Vitest testing framework
- Support for timestamped output directories
- Backwards compatibility with direct config file usage

---

## Release Notes Format

Each release includes:
- **Added**: New features
- **Changed**: Changes in existing functionality  
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security improvements