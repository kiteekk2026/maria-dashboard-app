# Contributing Guidelines

Thank you for contributing to the Dashboard App!

This document describes the basic workflow for making changes to the project.

## 1. Getting Started

Before making changes, make sure you have:
- Git installed.
- Node.js installed.
- pnpm installed.
- Access to the project repository.

Clone the repository and install dependencies:

```bash
git clone https://github.com/kiteekk2026/maria-dashboard-app.git
cd maria-dashboard-app
pnpm install
```

Configure the required environment variables in your local `.env` file. Never commit secrets or credentials.

## 2. Branching Strategy

Do not develop new features directly on `main`.

Create a separate branch for each task:

```bash
git checkout main
git pull origin main
git checkout -b feat/short-description
```

Use descriptive branch names:
- `feat/customer-details`
- `fix/invoice-validation`
- `docs/update-readme`

## 3. Making Changes

- Keep changes focused on one task.
- Follow the existing code style and project conventions.
- Write clear, descriptive commit messages.
- Update documentation when necessary.
- Do not commit `.env` files, credentials, or other secrets.

Example commit message:

```bash
git add .
git commit -m "feat: improve customer details page"
```

## 4. Testing

Before opening a Pull Request, run:

```bash
pnpm lint
pnpm build
```

Fix any errors before requesting a review.

Test the changed functionality locally whenever possible.

## 5. Pull Requests

All changes must be submitted through a Pull Request to `main`.

Before opening a Pull Request:
- Push your feature branch to GitHub.
- Describe what you changed and why.
- Complete the Pull Request template.
- Explain how you tested the changes.
- Include screenshots for UI changes when appropriate.

Example:

```bash
git push -u origin feat/short-description
```

Open a Pull Request on GitHub and request a review from your review partner.

At least one approval is required before merging, according to the repository's branch protection rules.

## 6. Code Review

Reviewers should:
- Check that the code is understandable and maintainable.
- Look for possible bugs and edge cases.
- Check that the changes match the task requirements.
- Provide constructive and respectful feedback.

Address review comments before merging.

## 7. Security

- Never commit secrets, passwords, API keys, or database credentials.
- Keep environment variables in `.env` files that are excluded from Git.
- Report security concerns to the project owner.