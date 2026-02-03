# Gym Tracker - Contributing Guide

Thank you for your interest in contributing to Gym Tracker! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Focus on the code, not the person
- Help others learn and grow

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/gym-tracker.git`
3. Add upstream: `git remote add upstream https://github.com/ORIGINAL_OWNER/gym-tracker.git`
4. Create a feature branch: `git checkout -b feature/your-feature`

## Development Workflow

### Before You Start

- Check existing issues and pull requests
- Open an issue to discuss major changes
- Comment on related issues

### While Developing

- Follow the existing code style
- Write clear, descriptive commit messages
- Add tests for new features
- Update documentation as needed

### Before Submitting

- Ensure your code builds and runs
- Run tests: `npm test` in both backend and frontend
- Update README if adding features
- Keep commits clean and squashed

## Code Style

### TypeScript/JavaScript

- Use TypeScript for type safety
- Follow 2-space indentation
- Use descriptive variable names
- Add JSDoc comments for complex functions

### File Organization

- Keep files under 300 lines
- Group related functionality
- Use clear folder structure

## Commit Messages

```
type(scope): brief description

Detailed explanation if needed.
Mention issue numbers: Fixes #123
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Testing

Write tests for:

- New features
- Bug fixes
- Edge cases

```bash
# Run all tests
npm test

# Run specific test file
npm test -- filename.test.ts
```

## Documentation

Update docs for:

- New API endpoints
- Configuration changes
- Feature additions
- Breaking changes

## Pull Request Process

1. Update the README.md with any new features
2. Ensure CI/CD passes
3. Request review from maintainers
4. Address feedback promptly
5. Squash commits if requested

## Reporting Bugs

Include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots/logs if applicable

## Feature Requests

Describe:

- The use case
- Why it's needed
- Potential implementation approach
- Any concerns or constraints

## Getting Help

- Check existing documentation
- Search closed issues
- Ask in discussions
- Reach out to maintainers

---

Thank you for contributing! 🚀
