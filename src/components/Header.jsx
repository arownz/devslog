import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Modal, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import AddPost from "./post/AddPost";
import PostDetails from "./post/PostDetails";

export default function Header() {
  const { isDarkMode, toggleDarkMode } = useState();
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationType, setNotificationType] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showAddPostModal, setShowAddPostModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const notificationRef = useRef(null);
  const navigate = useNavigate();

  const getDashboardLink = () => {
    if (isAdmin) {
      return '/admin-dashboard';
    } else if (isLoggedIn) {
      return '/user-dashboard';
    }
    return '/';
  };

  useEffect(() => {
    const loggedInUser = sessionStorage.getItem('user');
    console.log('Logged in user data: ', loggedInUser);
    const loggedInAdmin = sessionStorage.getItem('admin');
    console.log('Logged in admin data: ', loggedInAdmin);
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser);
      setIsLoggedIn(true);
      setUser(user);
      if (user.profile_image && user.profile_image.startsWith('data:image')) {
        setUser({
          ...user,
          profile_image: user.profile_image
        });
      }
    } else if (loggedInAdmin) {
      setIsLoggedIn(true);
      setIsAdmin(true);
      setUser(JSON.parse(loggedInAdmin));
    }
  }, []);

  const fetchNotifications = async () => {
    if (!isLoggedIn) return;

    try {
      const endpoint = isAdmin
        ? 'http://localhost/devslog/server/get_admin_notifications.php'
        : 'http://localhost/devslog/server/get_notifications.php';

      const response = await fetch(endpoint, {
        credentials: 'include'
      });
      const data = await response.json();

      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.notifications.filter(n => !n.read).length);
        setNotificationType(isAdmin ? 'admin' : 'user');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, isAdmin]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleNotificationClick = async (notification) => {
    if (notificationType === 'admin') {
      setSelectedPostId(notification.post_id);
      setShowPostModal(true);
    } else {
      if (notification.type === 'rejected') {
        setRejectionReason(notification.admin_message || 'No specific reason provided');
        setShowRejectionModal(true);
      } else if (notification.post_id) {
        setSelectedPostId(notification.post_id);
        setShowPostModal(true);
      }
    }

    if (!notification.read) {
      try {
        const endpoint = notificationType === 'admin'
          ? 'http://localhost/devslog/server/mark_admin_notification_read.php'
          : 'http://localhost/devslog/server/mark_notification_read.php';

        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notification_id: notification.id }),
          credentials: 'include'
        });
        fetchNotifications();
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
  };

  const handleDeleteNotification = async (e, notificationId) => {
    e.stopPropagation();
    try {
      const endpoint = notificationType === 'admin'
        ? 'http://localhost/devslog/server/delete_admin_notification.php'
        : 'http://localhost/devslog/server/delete_notification.php';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notification_id: notificationId }),
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        fetchNotifications();
        message.success('Notification deleted');
      }
    } catch (error) {
      message.error('Failed to delete notification');
    }
  };


  const handleSignInClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleLogout = () => {
    if (isAdmin) {
      sessionStorage.removeItem('admin');
      navigate('/admin-signin');
    } else {
      sessionStorage.removeItem('user');
      navigate('/signin');
    }
    setIsLoggedIn(false);
    setUser(null);
    setIsAdmin(false);
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const renderNotificationContent = (notification) => {
    if (isAdmin) {
      return (
        <div className="flex flex-col">
          <p className="font-medium">{notification.username}&apos;s Post</p>
          <p className="text-sm">{notification.title}</p>
          <p className="text-xs text-gray-500">{notification.message}</p>
        </div>
      );
    }
    return <p>{notification.message}</p>;
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 h-16 shadow-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <Link to={getDashboardLink()} className="flex items-center text-2xl font-bold text-green-700 mr-8">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/1b7534d8e2e8aebb42d2c416dac3979c0a09e9a096b9a214a7d1e6af7326f39a?placeholderIfAbsent=true&apiKey=b3b06d4cff934296b9a04a1b4e7061de"
            className="w-15 h-10 mr-0"
            alt="Devlog Logo"
          />
          DEVSLOG
        </Link>

        {/* Guest Header */}
        {!isLoggedIn && (
          <nav className="flex space-x-6 text-lg">
            {/* <Link to="/posts" className="text-gray-700 hover:text-green-700 transition-colors duration-200">Forum</Link> */}
            <Link to="/about" className="text-gray-700 hover:text-green-700 transition-colors duration-200">About Us?</Link>
          </nav>
        )}

        {/* User Header */}
        {isLoggedIn && !isAdmin && (
          <nav className="flex space-x-6 text-lg">
            <button
              onClick={() => setShowAddPostModal(true)}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-4 rounded hover:text-green-100 transition-colors duration-200 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Post
            </button>
          </nav>
        )}

        {/* Search Bar (centered for all views) */}
        <div className="flex-grow flex justify-center">
          <form className="w-1/3 flex items-center bg-gray-100 rounded-full px-4 py-2">
            <input
              type="search"
              placeholder="Search..."
              className="w-full bg-transparent border-none outline-none"
            />
            <button type="submit" aria-label="Search">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>

        <div className="flex items-center ml-auto space-x-4">
          <button onClick={toggleDarkMode} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200">
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* New Notification Icon Button */}
          {isLoggedIn && (
            <div className="relative" ref={notificationRef}>
              <button
                onClick={toggleNotifications}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200 relative"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className={`absolute right-0 mt-2 w-96 rounded-md shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'
                  }`}>
                  <div className="py-2 max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 flex justify-between items-start cursor-pointer ${!notification.read
                            ? isDarkMode ? 'bg-blue-900' : 'bg-blue-50'
                            : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                            }`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex-1 pr-4">
                            {renderNotificationContent(notification)}
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(notification.created_at).toLocaleString()}
                            </p>
                          </div>
                          <DeleteOutlined
                            className={`text-gray-400 hover:text-red-500`}
                            onClick={(e) => handleDeleteNotification(e, notification.id)}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-center text-gray-500">
                        No notifications
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          )}
          {isLoggedIn ? (
            <div className="relative">
              <button onClick={toggleDropdown} className="flex items-center space-x-2 focus:outline-none">
                {isAdmin ? (
                  <>
                    <span className="text-gray-700">{user ? user.email : 'Admin'}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      {user && user.profile_image ? (
                        <img
                          src={user.profile_image}
                          alt="Profile"
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            {user && user.username ? user.username[0].toUpperCase() : 'Profile Image'}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="text-gray-700">{user ? user.username : 'User'}</span>
                  </>
                )}
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  {isAdmin ? (
                    <>
                      <Link to="/admin-profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                    </>
                  ) : (
                    <>
                      <Link to="/user-profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                      <Link to="/user-settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Link>
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                    </>
                  )}
                </div>
              )}
            </div>

          ) : (
            <button
              onClick={handleSignInClick}
              className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors duration-200"
            >
              Sign In
            </button>
          )}

        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full transform transition-all duration-300 ease-in-out">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Choose Sign In Option</h2>
            <div className="flex flex-col space-y-4">
              <Link
                to="/signin"
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition duration-300 text-center"
                onClick={closeModal}
              >
                User Sign In
              </Link>
              <Link
                to="/admin-signin"
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition duration-300 text-center"
                onClick={closeModal}
              >
                Admin Sign In
              </Link>
            </div>
            <button
              onClick={closeModal}
              className="mt-6 text-gray-600 hover:text-gray-800 transition duration-300 w-full text-center"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showAddPostModal && (
        <AddPost onClose={() => setShowAddPostModal(false)} />
      )}
      <Modal
        title="Post Rejected"
        open={showRejectionModal}
        onOk={() => setShowRejectionModal(false)}
        onCancel={() => setShowRejectionModal(false)}
        className={isDarkMode ? 'dark-theme' : ''}
      >
        <p className="text-red-500 font-medium mb-2">
          This post has been rejected by the administrator.
        </p>
        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
          {rejectionReason}
        </p>
      </Modal>

      {showPostModal && (
        <PostDetails
          postId={selectedPostId}
          onClose={() => {
            setShowPostModal(false);
            setSelectedPostId(null);
          }}
        />
      )}
    </header>
  );
}
