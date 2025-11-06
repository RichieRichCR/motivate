# @repo/ui

Shared UI component library built with shadcn/ui and Tailwind CSS v4.

## Features

- ✨ Pre-configured with Tailwind CSS v4
- 🎨 Shared theme across all apps
- 🧩 shadcn/ui components ready to add
- 📦 Fully typed with TypeScript
- 🎯 CSS variables for theming

## Installation

This package is used internally in the monorepo. To use it in your app:

```json
{
  "dependencies": {
    "@repo/ui": "workspace:*",
    "@repo/tailwind-config": "workspace:*"
  }
}
```

In your app's CSS file:

```css
@import '@repo/tailwind-config/globals.css';
```

## Adding Components

To add shadcn/ui components, navigate to the UI package:

```bash
cd packages/ui
npx shadcn@latest add button
```

## Usage

```tsx
import { Button } from '@repo/ui';

export default function App() {
  return <Button>Click me</Button>;
}
```

## Exporting Components

When you add a new component, export it from `src/index.ts`:

```ts
export { Button } from './components/ui/button';
```

## Customizing Theme

Edit `packages/tailwind/globals.css` to customize the theme variables. Changes will apply to all apps in the monorepo.
