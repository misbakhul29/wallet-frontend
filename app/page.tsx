import { redirect } from 'next/navigation';
import UserDashboard from './components/UserDashboard';

export default async function Home() {
  const username: string = "user_table_test";

  // const user = await fetch(`https://wallet-express-pg.vercel.app/api/wallet/${username}/wallets`);

  // const dataUser = await user.json();

  if (!username) {
    redirect('/login');
    return null;
  }

  return (
    <div className=''>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome, {username}!</h2>

      <UserDashboard username={username} />
    </div>
  );
}