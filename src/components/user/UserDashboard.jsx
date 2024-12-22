import { useEffect, useState } from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';
import PostCard from '../post/PostCard';

export function UserDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch user's posts from the database
    // For now, we'll use dummy data
    setPosts([
      { id: 1, title: "My First Post", author: "User", time: "2 hours ago", image: "https://placehold.co/600x400", upvotes: 10, downvotes: 2, comments: 5, isBookmarked: false },
      // ... more posts ...
    ]);
  }, []);

  const handleUpvote = () => {
    // Handle upvote logic
  };

  const handleDownvote = () => {
    // Handle downvote logic
  };

  const handleBookmark = () => {
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

