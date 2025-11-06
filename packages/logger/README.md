# @repo/logger

Production-ready logger built on [Pino](https://github.com/pinojs/pino).

## Features

- 🚀 **Fast**: Minimal overhead, fastest Node.js logger
- 📊 **Structured**: JSON logging for easy parsing
- 🎨 **Pretty Dev Mode**: Colorized output during development
- 🔧 **Configurable**: Log levels and formatting
- 🌍 **Universal**: Works in Node.js, browsers, and edge runtimes

## Installation

```bash
pnpm add @repo/logger
```

## Usage

### Basic Logging

```typescript
import { logger } from '@repo/logger';

logger.info('Application started');
logger.error('Something went wrong', { error: err });
logger.debug('Debug info', { userId: 123 });
logger.warn('Warning message');
```

### Child Loggers (Recommended)

Create child loggers with context for better tracing:

```typescript
import { createLogger } from '@repo/logger';

// String context
const apiLogger = createLogger('api');
apiLogger.info('Request received');

// Object context
const userLogger = createLogger({ module: 'auth', userId: 123 });
userLogger.info('User logged in');
```

### Next.js Example

```typescript
// app/api/users/route.ts
import { createLogger } from '@repo/logger';

const logger = createLogger('api:users');

export async function GET() {
  logger.info('Fetching users');
  // ... your code
  logger.info('Users fetched', { count: users.length });
  return Response.json(users);
}
```

### Cloudflare Workers / Hono Example

```typescript
import { Hono } from 'hono';
import { createLogger } from '@repo/logger';

const app = new Hono();
const logger = createLogger('worker');

app.get('/health', (c) => {
  logger.info('Health check');
  return c.json({ status: 'ok' });
});
```

## Configuration

### Environment Variables

- `LOG_LEVEL`: Set logging level (default: `info`)
  - Options: `trace`, `debug`, `info`, `warn`, `error`, `fatal`
- `NODE_ENV`: Set to `production` for JSON output

### Example

```bash
# Development (pretty output)
LOG_LEVEL=debug pnpm dev

# Production (JSON output)
NODE_ENV=production pnpm start
```

## Log Levels

```typescript
logger.trace('Trace level'); // Most verbose
logger.debug('Debug info');
logger.info('Info message'); // Default
logger.warn('Warning');
logger.error('Error', { err });
logger.fatal('Fatal error'); // Most severe
```

## Output Format

**Development:**

```
[13:45:32] INFO: Application started
    context: "api"
```

**Production:**

```json
{
  "level": 30,
  "time": 1699280732123,
  "context": "api",
  "msg": "Application started"
}
```

## TypeScript

Full TypeScript support included:

```typescript
import type { Logger } from '@repo/logger';

function setupLogger(): Logger {
  return createLogger('app');
}
```
