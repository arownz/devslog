import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { HomeIcon, UserGroupIcon, BookmarkIcon, ClockIcon, ChevronRightIcon, ChevronLeftIcon, Cog6ToothIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import PropTypes from 'prop-types';

const Sidebar = ({ isAdmin }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [headerHeight, setHeaderHeight] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const header = document.querySelector('header');
    if (header) {
      setHeaderHeight(header.offsetHeight);
    }
  }, []);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const userMenuItems = [
    { icon: HomeIcon, text: 'My Feed', link: '/user-dashboard' },
    { icon: BookmarkIcon, text: 'Bookmarks', link: '/user-dashboard/bookmarks' },
    { icon: ClockIcon, text: 'Reading History', link: '/user-dashboard/history' },
    { icon: Cog6ToothIcon, text: 'Settings', link: '/user-dashboard/settings' },
  ];

  const adminMenuItems = [
    { icon: HomeIcon, text: 'Dashboard', link: '/admin-dashboard' },
    { icon: DocumentTextIcon, text: 'Post Management', link: '/admin-dashboard/posts' },
    { icon: UserGroupIcon, text: 'User Management', link: '/admin-dashboard/users' },
    { icon: Cog6ToothIcon, text: 'Site Settings', link: '/admin-dashboard/settings' },
  ];

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  return (
    <div 
      className={`fixed left-0 top-0 h-full bg-white shadow-lg text-gray-800 transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'}`}
      style={{ top: `${headerHeight}px`, height: `calc(100% - ${headerHeight}px)` }}
    >
      <div className="flex flex-col h-full">
        <nav className="flex-grow">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className="flex items-center px-4 py-3 hover:bg-gray-100 border-b border-gray-200"
              onClick={() => navigate(item.link)}
            >
              <item.icon className="h-6 w-6 mr-4 text-gray-600" />
              {isOpen && <span>{item.text}</span>}
            </Link>
          ))}
        </nav>
        <button
          className="absolute top-2 -right-3 bg-white text-gray-800 p-1 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
          onClick={toggleSidebar}
        >
          {isOpen ? <ChevronLeftIcon className="h-5 w-5" /> : <ChevronRightIcon className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
};

export default Sidebar;

