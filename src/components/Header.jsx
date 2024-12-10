import { Link } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // You would implement the actual dark mode logic here
  };

  const handleSignInClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <Link to="/" className="flex items-center text-2xl font-bold text-green-700 mr-8">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/1b7534d8e2e8aebb42d2c416dac3979c0a09e9a096b9a214a7d1e6af7326f39a?placeholderIfAbsent=true&apiKey=b3b06d4cff934296b9a04a1b4e7061de"
            className="w-13 h-14 mr-1"
            alt="Devlog Logo"
          />
          DEVLOG
        </Link>
        <nav className="flex space-x-6 text-lg">
          <Link to="/blogs" className="text-gray-700 hover:text-green-700">Blogs</Link>
          <Link to="/about" className="text-gray-700 hover:text-green-700">About</Link>
        </nav>
        <div className="flex items-center ml-auto space-x-4">
          <form className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2">
            <input
              type="search"
              placeholder="Search Post..."
              className="bg-transparent border-none outline-none"
            />
            <button type="submit" aria-label="Search">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
          <button onClick={toggleDarkMode} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          <button
            onClick={handleSignInClick}
            className="bg-green-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-700"
          >
            Sign In
          </button>
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
                to="/admin/signin"
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition duration-300 text-center"
                onClick={closeModal}
              >
                Admin Sign In
              </Link>
            </div>
            <button
              onClick={closeModal}
              className="mt-6 text-gray-600  hover:text-gray-800 transition duration-300 w-full text-center"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
