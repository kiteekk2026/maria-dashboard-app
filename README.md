# Dashboard App

A dashboard application built with Next.js. It allows users to view business metrics, manage invoices, and manage customer information through a searchable and paginated interface.

## Live Demo

**[Open the Dashboard App](https://maria-dashboard-app.vercel.app/)**

## Features

- View dashboard metrics and revenue charts.
- Browse, search, and paginate customer records.
- View individual customer details.
- Create and edit customer records.
- Delete customers when they have no associated invoices.
- Create, edit, and delete invoices.
- Validate form input and display helpful error messages.
- Authenticate users to protect dashboard pages.

## Tech Stack

- **Next.js** — React framework with the App Router.
- **React** — UI library.
- **TypeScript** — static typing.
- **Tailwind CSS** — styling.
- **PostgreSQL** — database.
- **NextAuth.js** — authentication.
- **Zod** — data validation.
- **ESLint** — code linting.
- **pnpm** — package manager.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- pnpm
- Access to a PostgreSQL database configured for this application.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/kiteekk2026/maria-dashboard-app.git
   cd maria-dashboard-app
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Configure environment variables.

   Create a `.env` file in the project root and add the environment variables required by the application. Check the existing environment variable examples or configuration in the project to determine the required names and values.

   Do not commit secrets, passwords, or environment files containing credentials.

4. Start the development server:

   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Starts the development server. |
| `pnpm build` | Builds the application for production. |
| `pnpm start` | Starts the production server. Run `pnpm build` first. |
| `pnpm lint` | Runs ESLint to check the code. |

## Team

- **Developer:** Maria Fominova
- **Review partner:** Olga Diunova