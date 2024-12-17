import { useEffect, useState } from 'react';
import { useNavigate, Route, Routes } from 'react-router-dom';
import PropTypes from 'prop-types';
import Header from '../Header';
import Sidebar from '../Sidebar';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const loggedInAdmin = localStorage.getItem('admin');
    if (loggedInAdmin) {
      setAdmin(JSON.parse(loggedInAdmin));
    } else {
      navigate('/admin-signin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin');
    navigate('/admin-signin');
  };

  if (!admin) return null;
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-grow">
        <Sidebar isAdmin={true} />
        <main className="flex-grow p-8 ml-64">
          <Routes>
            <Route path="/" element={<AdminDashboardHome admin={admin} handleLogout={handleLogout} />} />
            <Route path="/posts" element={<PostManagement />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/settings" element={<SiteSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function AdminDashboardHome({ handleLogout }) {
  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Welcome, Admin!</h1>
      <p className="mb-4">This is your admin dashboard.</p>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </>
  );
}

AdminDashboardHome.propTypes = {
  handleLogout: PropTypes.func.isRequired,
};

function PostManagement() {
  return <h2>Post Management</h2>;
}

function UserManagement() {
  return <h2>User Management</h2>;
}

function SiteSettings() {
  return <h2>Site Settings</h2>;
}

