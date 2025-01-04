import { useEffect, useState } from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';
import PostCard from '../post/PostCard';
import { formatDistanceToNow } from 'date-fns'; // Add this import

export function UserDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('http://localhost/devslog/server/get_all_posts.php', {
          credentials: 'include'
        });
        const data = await response.json();
        console.log('Fetched data:', data);
        if (data.success) {
          // Process the posts to add the timeAgo property
          const processedPosts = data.posts.map(post => ({
            ...post,
            timeAgo: formatDistanceToNow(new Date(post.created_at), { addSuffix: true })
          }));
          setPosts(processedPosts);
          console.log('Posts set:', processedPosts);
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
                  id={post.id}
                  image={post.thumbnail || 'default-image-url.jpg'}
                  created_at={post.created_at}
                  author={post.author}
                  title={post.title}
                  upvotes={post.upvotes}
                  downvotes={post.downvotes}
                  comments={post.comments_count}
                  isLoggedIn={true}
                  onUpvote={handleUpvote}
                  onDownvote={handleDownvote}
                  onBookmark={handleBookmark}
                  isBookmarked={post.is_bookmarked}
                  layout="grid"
                />
              ))}
            </div>
          ) : (
            <p>No posts available.</p>
          )}
        </main>
      </div>
    </div>
  );
}

