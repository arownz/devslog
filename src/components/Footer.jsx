import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-green-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Explore the site</h2>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="hover:text-green-400 transition duration-300">Home</Link>
              {/* <Link to="/posts" className="hover:text-green-400 transition duration-300">Forum</Link> */}
              <Link to="/about" className="hover:text-green-400 transition duration-300">About Us?</Link>
            </nav>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Connect with us</h2>
            <div className="flex space-x-4">
              <a href="https://github.com/arownz/devslog" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition duration-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              {/* Add more social media icons here if needed */}
            </div>
          </div>
          <div className="text-center md:text-right">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/1b7534d8e2e8aebb42d2c416dac3979c0a09e9a096b9a214a7d1e6af7326f39a?placeholderIfAbsent=true&apiKey=b3b06d4cff934296b9a04a1b4e7061de"
              className="w-21 h-20 mx-auto md:ml-auto md:mr-0 mb-4"
              alt="Devlog Logo"
            />
            <p className="text-sm">© Devslog {new Date().getFullYear()}</p>
            <p className="text-sm mt-2">Created by Devslog&apos;s team</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
