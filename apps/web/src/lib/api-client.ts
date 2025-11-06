import { hc } from 'hono/client';
import type { AppType } from '@repo/api';

// Create a type-safe client
export const client = hc<AppType>(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787',
);

// Example usage:
// const response = await client.posts.$post({
//   form: {
//     title: 'Hello',
//     body: 'World'
//   }
// });
// const data = await response.json();
