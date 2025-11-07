# Motivate

A full-stack health and fitness tracking application built with modern web technologies. Track your daily metrics, set goals, and visualize your progress over time.

## 🚀 Features

- **Health Metrics Tracking**: Monitor weight, steps, exercise, distance, water intake, and more
- **Goal Setting**: Set and track both daily and long-term fitness goals
- **Visual Analytics**: Interactive charts and graphs to visualize your progress
- **Apple Health Integration**: Import data from Apple Health
- **Real-time Dashboard**: View all your metrics and progress at a glance

## 🏗️ Tech Stack

### Frontend

- **Next.js 16** - React framework with App Router
- **React 19** - Latest React features
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Data visualization library
- **shadcn/ui** - Beautiful, accessible UI components

### Backend

- **Hono** - Ultrafast web framework
- **Cloudflare Workers** - Edge computing platform
- **Supabase** - PostgreSQL database with authentication
- **Drizzle ORM** - Type-safe database toolkit
- **Zod** - TypeScript-first schema validation

### Tooling

- **Turborepo** - High-performance build system for monorepos
- **pnpm** - Fast, disk space efficient package manager
- **TypeScript** - Type safety across the entire stack
- **Vitest** - Unit testing framework
- **ESLint & Prettier** - Code quality and formatting

## 📦 Project Structure

This is a monorepo with the following structure:

```
motivate/
├── apps/
│   ├── api/          # Cloudflare Workers API (Hono)
│   └── web/          # Next.js web application
├── packages/
│   ├── api/          # Shared API routes and logic
│   ├── db/           # Database schema and migrations (Drizzle)
│   ├── ui/           # Shared UI components (shadcn/ui)
│   ├── logger/       # Logging utilities
│   ├── tailwind/     # Tailwind configuration
│   ├── config-eslint/    # ESLint configurations
│   ├── config-typescript/ # TypeScript configurations
│   └── vitest-presets/   # Vitest test configurations
└── supabase/         # Supabase configuration and migrations
```

## 🛠️ Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 10.15.1

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd motivate
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in each app directory
   - Configure your Supabase credentials and other required variables

4. Set up the database:

```bash
pnpm db:push
```

### Development

Start all applications in development mode:

```bash
pnpm dev
```

This will start:

- Web app on `http://localhost:3000`
- API on Cloudflare Workers local environment

### Individual Commands

```bash
# Build all apps and packages
pnpm build

# Run tests
pnpm test

# Lint all packages
pnpm lint

# Format code
pnpm format

# Type checking
pnpm check-types

# Database commands
pnpm db:push     # Push schema changes
pnpm db:studio   # Open Drizzle Studio
```

## 📊 Database Schema

The application uses a PostgreSQL database with the following main tables:

- **users** - User accounts and profiles
- **metric_types** - Types of metrics that can be tracked (steps, weight, etc.)
- **measurements** - Individual metric measurements with timestamps
- **goals** - User-defined fitness goals (daily or long-term)

## 🧪 Testing

Tests are written using Vitest:

```bash
# Run all tests
pnpm test

# Run tests in a specific package
pnpm --filter @repo/api test
pnpm --filter @repo/logger test
```

## 🚢 Deployment

### API (Cloudflare Workers)

```bash
cd apps/api
pnpm deploy              # Deploy to production
pnpm deploy:staging      # Deploy to staging
pnpm deploy:dev          # Deploy to development
```

### Web (Next.js)

The web app can be deployed to any platform that supports Next.js 16:

- Vercel
- Netlify
- Cloudflare Pages
- Self-hosted

## 📝 Environment Variables

### Web App (`apps/web/.env`)

```
NEXT_PUBLIC_API_URL=<your-api-url>
USER_ID=<default-user-id>
```

### API (`apps/api/.env`)

```
SUPABASE_URL=<your-supabase-url>
SUPABASE_KEY=<your-supabase-key>
```

### Database (`packages/db/.env`)

```
DATABASE_URL=<your-postgres-connection-string>
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🙏 Acknowledgments

- Built with [Turborepo](https://turbo.build/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Powered by [Supabase](https://supabase.com/)
- Deployed on [Cloudflare Workers](https://workers.cloudflare.com/)
