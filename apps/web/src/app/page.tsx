import { Dashboard } from '../components/dash';

// Force dynamic rendering - don't prerender at build time

export const revalidate = 1000 * 60 * 60 * 24;

export default async function Home() {
  return (
    <div className="container flex flex-col items-center justify-center">
      <Dashboard />
    </div>
  );
}
