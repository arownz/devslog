import { useEffect, useState } from 'react';
import { useNavigate, Route, Routes } from 'react-router-dom';
import Header from '../Header';
import Sidebar from '../Sidebar';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import PropTypes from 'prop-types';
import PostManagement from './PostsManage';
import UserManagement from './UsersManage';
import SiteSettings from './SiteSetting';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
export function AdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    userCount: 0,
    postCount: 0,
    commentCount: 0,
  });
  const [monthlyPosts, setMonthlyPosts] = useState({});

  useEffect(() => {
    const loggedInAdmin = sessionStorage.getItem('admin');
    if (loggedInAdmin) {
      setAdmin(JSON.parse(loggedInAdmin));
    } else {
      navigate('/admin-signin');
    }

    // Fetch dashboard stats
    fetch('http://localhost/devslog/server/admin_dashboard_stats.php', {
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => {
        if (data.error === 'Unauthorized') {
          sessionStorage.removeItem('admin');
          navigate('/admin-signin');
        } else {
          setStats(data);
        }
      })
      .catch(error => console.error('Error fetching dashboard stats:', error));

    // Fetch monthly post data
    fetch('http://localhost/devslog/server/admin_monthly_posts.php', {
      credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
      if (data.error === 'Unauthorized') {
        sessionStorage.removeItem('admin');
        navigate('/admin-signin');
      } else {
        console.log('Monthly posts data:', data);
        setMonthlyPosts(data);
      }
    })
    .catch(error => console.error('Error fetching monthly posts:', error));
  }, [navigate]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const chartData = {
    labels: Object.keys(monthlyPosts).map(date => {
      const [year, month] = date.split('-');
      return `${months[parseInt(month) - 1]} ${year}`;
    }),
    datasets: [
      {
        label: 'Number of Posts per Month',
        data: Object.values(monthlyPosts),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Posts Distribution by Month',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Posts',
        },
        ticks: {
          stepSize: 1,
        }
      }
    }
  };
  
  if (!admin) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-grow">
        <Sidebar isAdmin={true} setIsSidebarOpen={setIsSidebarOpen} />
        <main className={`flex-grow p-8 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
          <Routes>
            <Route path="/" element={
    <div className="pt-20 px-4"> {/* Added padding-top and padding-x */}
         <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <StatCard title="Total Users" value={stats.userCount} />
                  <StatCard title="Total Posts" value={stats.postCount} />
                  <StatCard title="Total Comments" value={stats.commentCount} />
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-semibold mb-4">Posts per Month</h2>
                  <Bar data={chartData} options={chartOptions} />
                </div>

              </div>
            } />
            <Route path="/posts" element={<PostManagement />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/settings" element={<SiteSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};