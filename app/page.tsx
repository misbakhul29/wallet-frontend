import { redirect } from 'next/navigation';
import UserDashboard from './components/UserDashboard';

export default function Home() {
  const username: string = "user_table_test"; 

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