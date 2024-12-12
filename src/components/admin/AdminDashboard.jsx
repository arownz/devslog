import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';

export function AdminDashboard() {
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem('admin'));

  if (!admin) {
    navigate('/admin-signin');
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('admin');
    navigate('/admin-signin');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Welcome, Admin!</h1>
        <p className="mb-4">This is your admin dashboard.</p>
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