# @repo/vitest-presets

Shared Vitest configurations for the monorepo.

## Usage

### Node Environment

For packages that run in Node.js (e.g., backend APIs, CLI tools):

```typescript
// vitest.config.ts
import { mergeConfig } from 'vitest/config';
import baseConfig from '@repo/vitest-presets/node/vitest-preset';

export default mergeConfig(baseConfig, {
  test: {
    // Add package-specific config here
  },
});
```

### Browser/JSDOM Environment

For packages that need a browser-like environment (e.g., React components, frontend code):

```typescript
// vitest.config.ts
import { mergeConfig } from 'vitest/config';
import baseConfig from '@repo/vitest-presets/browser/vitest-preset';

export default mergeConfig(baseConfig, {
  test: {
    // Add package-specific config here
  },
});
```

## What's Included

### Node Preset

- Node environment
- Global test APIs (describe, it, expect, etc.)
- TypeScript support
- Common exclusions (node_modules, dist, etc.)

### Browser Preset

- JSDOM environment for DOM APIs
- Global test APIs
- TypeScript support
- Common exclusions

## Migrated from Jest

This package replaces `@repo/jest-presets`. Key differences:

- ✅ Faster test execution
- ✅ Native ESM support
- ✅ Better TypeScript integration
- ✅ No need for babel/ts-jest transformers
- ✅ Built-in watch mode
