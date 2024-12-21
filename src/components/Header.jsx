import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
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
    const loggedInUser = localStorage.getItem('user');
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
      } /* else if (user.profile_image) { // If it's not base64, assume it's a filename and construct the URL
        setUser({
          ...user,
          profile_image: `http://localhost/devslog/uploads/${user.profile_image}`
        });
      } */
    } else if (loggedInAdmin) {
      setIsLoggedIn(true);
      setIsAdmin(true);
      setUser(JSON.parse(loggedInAdmin));
    }
  }, []);

  useEffect(() => {
    // Simulating fetching notifications
    const fetchNotifications = () => {
      const mockNotifications = [
        { id: 1, message: "Notify 1", read: false },
        { id: 2, message: "Notify 2", read: false },
        { id: 3, message: "Notify 3", read: true },
      ];
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
    };

    if (isLoggedIn) {
      fetchNotifications();
    }
  }, [isLoggedIn]);

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

  const handleNotificationClick = (id) => {
    // Mark notification as read
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => prev - 1);
    // Handle notification click (e.g., navigate to relevant page)
    console.log(`Clicked notification ${id}`);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Implement the actual dark mode logic here
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
      localStorage.removeItem('user');
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

  return (
    <header className="bg-white shadow-sm sticky top-0 left-0 right-0 z-30">
      <div className="container mx-auto px-0 py-5 flex items-center">
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
            <Link to="/posts" className="text-gray-700 hover:text-green-700 transition-colors duration-200">Forum</Link>
            <Link to="/about" className="text-gray-700 hover:text-green-700 transition-colors duration-200">About Us?</Link>
          </nav>
        )}

        {/* User Header */}
        {isLoggedIn && !isAdmin && (
          <nav className="flex space-x-6 text-lg">
            <button className="text-gray-700 hover:text-green-700 transition-colors duration-200 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Post
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
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
                  <div className="py-2">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-gray-100 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                        onClick={() => handleNotificationClick(notification.id)}
                      >
                        <p className={`text-sm ${!notification.read ? 'font-semibold' : ''}`}>
                          {notification.message}
                        </p>
                      </div>
                    ))}
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
    </header>
  );
}

