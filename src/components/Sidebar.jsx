import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HomeIcon, UserGroupIcon, BookmarkIcon, ClockIcon, ChevronRightIcon, ChevronLeftIcon, Cog6ToothIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

import PropTypes from 'prop-types';
const Sidebar = ({ isAdmin }) => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

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
    <div className={`fixed left-0 top-16 h-full bg-gray-800 text-white transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'} z-10`}>
      <button
        className="absolute -right-3 top-9 bg-gray-800 text-white p-1 rounded-full"
        onClick={toggleSidebar}
      >
        {isOpen ? <ChevronLeftIcon className="h-5 w-5" /> : <ChevronRightIcon className="h-5 w-5" />}
      </button>
      <nav className="mt-8">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.link}
            className="flex items-center px-4 py-2 hover:bg-gray-700"
            onClick={() => navigate(item.link)}
          >
            <item.icon className="h-6 w-6 mr-2" />
            {isOpen && <span>{item.text}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
};

Sidebar.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
};

export default Sidebar;