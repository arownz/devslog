import { useEffect, useState } from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';
import PropTypes from 'prop-types';
import PostCard from '../post/PostCard' // Adjust the import path as necessary

export function UserDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch user's posts from the server
    // For now, we'll use dummy data
    setPosts([
      { id: 1, title: "My First Post", author: "User", time: "2 hours ago", image: "https://placehold.co/600x400", upvotes: 10, downvotes: 2, comments: 5, isBookmarked: false },
      // ... more posts ...
    ]);
  }, []);

  const handleUpvote = (id) => {
    // Handle upvote logic
  };

  const handleDownvote = (id) => {
    // Handle downvote logic
  };

  const handleBookmark = (id) => {
    // Handle bookmark logic
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-grow">
        <Sidebar isAdmin={false} setIsSidebarOpen={setIsSidebarOpen} />
        <main className={`flex-grow p-8 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
          <h1 className="text-3xl font-bold mb-6">Your Posts</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                {...post}
                isLoggedIn={true}
                onUpvote={() => handleUpvote(post.id)}
                onDownvote={() => handleDownvote(post.id)}
                onBookmark={() => handleBookmark(post.id)}
                layout="grid"
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

function UserDashboardHome({ user, handleLogout }) {
  return (
    <>
    {/* Remove this because this is temporary */}
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

