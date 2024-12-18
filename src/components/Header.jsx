import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
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
    const loggedInAdmin = localStorage.getItem('admin');
    if (loggedInUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(loggedInUser));
    } else if (loggedInAdmin) {
      setIsLoggedIn(true);
      setIsAdmin(true);
      setUser(JSON.parse(loggedInAdmin));
    }
  }, []);

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
      localStorage.removeItem('admin');
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
            <Link to="/posts" className="text-gray-700 hover:text-green-700 transition-colors duration-200">Posts</Link>
            <Link to="/about" className="text-gray-700 hover:text-green-700 transition-colors duration-200">Aboutss</Link>
          </nav>
        )}

        {/* Admin Header 
        {isLoggedIn && isAdmin && (
          <nav className="flex space-x-6 text-lg">
            <Link to="/post-management" className="text-gray-700 hover:text-green-700">Post Management</Link>
            <Link to="/user-management" className="text-gray-700 hover:text-green-700">User Management</Link>
            <Link to="/site-settings" className="text-gray-700 hover:text-green-700">Site Settings</Link>
          </nav>
        )}*/}


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

          {isLoggedIn ? (
            <>
              {!isAdmin && (
                <button className="relative p-2 text-gray-700 hover:text-green-700 transition-colors duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {/* Add notification badge here if needed */}
                </button>
              )}
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 text-gray-700 hover:text-green-700 transition-colors duration-200"
                >
                  <img
                    src={user.avatar || "https://via.placeholder.com/40"}
                    alt="User avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{user.name}</span>
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => setShowDropdown(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/setting"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => setShowDropdown(false)}
                    >
                      Setting
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button
              onClick={handleSignInClick}
              className="bg-green-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-700 transition-colors duration-200"
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
