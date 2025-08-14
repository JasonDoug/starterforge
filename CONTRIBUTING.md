# Contributing to StarterForge

Thank you for considering contributing to StarterForge! We welcome contributions from the community and are pleased to have them.

## Getting Started

### Prerequisites

- Node.js 16 or higher
- npm (comes with Node.js)

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/yourusername/starterforge.git
   cd starterforge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run tests to ensure everything works**
   ```bash
   npm test
   ```

4. **Start the development web server**
   ```bash
   npm run web
   ```

## Project Structure

```
starterforge/
├── starterforge-cli.mjs        # Main CLI tool
├── starterforge.config.schema.js  # Configuration schema
├── wizard-logic.js             # Shared wizard logic
├── web-server.mjs             # Web interface server
├── web/                       # Web interface files
├── tests/                     # Test files
└── docs/                      # Documentation
```

## Development Workflow

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow existing code style and conventions
   - Add tests for new functionality
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm test                    # Run all tests
   npm run test:watch         # Run tests in watch mode
   npm run test:coverage      # Check test coverage
   ```

4. **Test the CLI manually**
   ```bash
   node starterforge-cli.mjs create
   node starterforge-cli.mjs web
   node starterforge-cli.mjs list frameworks
   ```

### Code Standards

- **ES Modules**: Use `.mjs` extensions for ES module files
- **No emojis**: Keep code and documentation professional
- **Clear naming**: Use descriptive variable and function names
- **Comments**: Add comments for complex logic
- **Error handling**: Include proper error handling and user-friendly messages

### Testing

We use Vitest for testing. Tests should cover:

- **CLI functionality**: Command execution and output
- **Schema validation**: Configuration validation
- **File generation**: Scaffold creation and content
- **Web API**: Server endpoints and responses

**Test file patterns:**
- `*.test.js` for unit tests
- `tests/fixtures/` for test configuration files

### Commit Messages

Use clear, descriptive commit messages:

```
feat: add support for Svelte framework
fix: resolve CLI command parsing issue
docs: update README with new web command
test: add coverage for auth provider filtering
```

## Types of Contributions

### New Framework Support

To add support for a new framework:

1. Update `wizard-logic.js` data structures
2. Add generation logic in `starterforge-cli.mjs`
3. Update filtering functions if needed
4. Add tests for the new framework
5. Update documentation

### Bug Fixes

- Include a clear description of the bug
- Add a test that reproduces the issue
- Implement the fix
- Verify the test now passes

### Documentation

- Keep documentation clear and professional
- Update relevant sections when making changes
- Include code examples where helpful

### New Features

Before implementing major features:

1. Open an issue to discuss the feature
2. Get feedback from maintainers
3. Plan the implementation approach
4. Break large features into smaller PRs

## Submitting Changes

### Pull Request Process

1. **Ensure all tests pass**
   ```bash
   npm test
   ```

2. **Update documentation** if your changes affect user-facing functionality

3. **Create a pull request** with:
   - Clear title and description
   - Link to any related issues
   - Screenshots for UI changes
   - Test instructions

4. **Respond to feedback** from maintainers promptly

### Pull Request Guidelines

- Keep PRs focused on a single feature or fix
- Include tests for new functionality
- Update documentation as needed
- Follow existing code style
- Write clear commit messages

## Code of Conduct

### Be Respectful

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Accept constructive criticism gracefully
- Focus on what is best for the community

### Be Professional

- Keep discussions focused on technical matters
- Provide constructive feedback
- Be patient with new contributors
- Help maintain a positive environment

## Getting Help

### Resources

- **Documentation**: Check existing docs first
- **Issues**: Search existing issues before creating new ones
- **Tests**: Look at existing tests for examples
- **Code**: Review similar functionality in the codebase

### Questions

For questions about:

- **Usage**: Create an issue with the "question" label
- **Development**: Create an issue with the "development" label
- **Bug reports**: Create an issue with the "bug" label

### Issue Templates

When creating issues, please include:

- **Bug reports**: Steps to reproduce, expected vs actual behavior, environment details
- **Feature requests**: Use case, proposed solution, alternatives considered
- **Questions**: Clear description of what you're trying to achieve

## Release Process

Releases are managed by maintainers:

1. Version bump following semantic versioning
2. Update CHANGELOG.md
3. Create GitHub release
4. Publish to npm registry

## License

By contributing to StarterForge, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be recognized in:

- GitHub contributors list
- Release notes for significant contributions
- Package.json contributors field (for major contributions)

Thank you for contributing to StarterForge!