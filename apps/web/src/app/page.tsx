import { Dashboard } from '../components/dash/dash';

// Revalidate every 24 hours
export const revalidate = 86400; // 60 * 60 * 24 seconds

export default async function Home() {
  return (
    <div className="container flex flex-col items-start justify-center gap-8 mb-16">
      <Dashboard />
    </div>
  );
}
