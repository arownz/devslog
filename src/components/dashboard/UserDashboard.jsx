import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';

export function UserDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    navigate('/signin');
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/signin');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Welcome, {user.username}!</h1>
        <p className="mb-4">This is your user dashboard.</p>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </main>
      <Footer />
    </div>
  );
}