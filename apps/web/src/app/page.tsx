import { Dashboard } from '../components/dash/dash';

// Revalidate every 24 hours
export const revalidate = 86400; // 60 * 60 * 24 seconds

export default async function Home() {
  return (
    <div className="container flex flex-col items-start justify-center gap-8">
      <h1 className="mt-10 text-lg font-bold text-left uppercase tracking-widest text-foreground/45 p-4 rounded-2xl bg-card px-8">
        Motivate RichieRich
      </h1>
      <Dashboard />
    </div>
  );
}
