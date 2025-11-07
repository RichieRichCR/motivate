import { Dashboard } from '../components/dash';

export default async function Home() {
  return (
    <div className="container flex flex-col items-center justify-center">
      <Dashboard />
    </div>
  );
}
