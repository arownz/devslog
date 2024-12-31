import { useEffect, useState } from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';
import PostCard from '../post/PostCard';

export function UserDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('http://localhost/devslog/server/get_user_posts.php', {
          credentials: 'include'
        });
        const data = await response.json();
        console.log('Fetched data:', data); // Log the fetched data
        if (data.success) {
          setPosts(data.posts);
          console.log('Posts set:', data.posts); // Log the posts being set
        } else {
          console.error('Failed to fetch posts:', data.message);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    }

    fetchPosts();
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
          <h1 className="text-3xl font-bold mb-6">Forum Posts</h1>
          {posts.length > 0 ? (
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
          ) : (
            <p>No posts found.</p>
          )}
        </main>
      </div>
    </div>
  );
}

