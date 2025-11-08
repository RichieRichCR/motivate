import { Dashboard } from '../components/dash/dash';

// Revalidate every 24 hours
export const revalidate = 86400; // 60 * 60 * 24 seconds

export default async function Home() {
  return (
    <div className="container flex flex-col items-center justify-center">
      <Dashboard />
    </div>
  );
}
