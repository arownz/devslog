import { useEffect, useState } from 'react';
import { useNavigate, Route, Routes } from 'react-router-dom';
import Header from '../Header';
import Sidebar from '../Sidebar';
import PropTypes from 'prop-types';

export function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    } else {
      navigate('/signin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/signin');
  };

  if (!user) return null;

return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-grow">
        <Sidebar isAdmin={false} setIsSidebarOpen={setIsSidebarOpen} />
        <main className={`flex-grow p-8 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
          <Routes>
            <Route path="/" element={<UserDashboardHome user={user} handleLogout={handleLogout} />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/history" element={<ReadingHistory />} />
            {/*<Route path="/settings" element={<UserSettings />} /> */}
          </Routes>
        </main>
      </div>
    </div>
  );
}

function UserDashboardHome({ user, handleLogout }) {
  return (
    <>
      <h1 className="text-3x10 font-bold mb-4">Welcome, {user.username}!</h1>
      <p className="mb-4">Email: {user.email}</p>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </>
  );
}

UserDashboardHome.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  handleLogout: PropTypes.func.isRequired,
};

function Bookmarks() {
  return <h2>Bookmarks</h2>;
}

function ReadingHistory() {
  return <h2>Reading History</h2>;
}

