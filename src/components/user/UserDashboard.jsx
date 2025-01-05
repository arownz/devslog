import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../Header';
import Sidebar from '../Sidebar';
import PostCard from '../post/PostCard';
import { formatDistanceToNow } from 'date-fns';
import PropTypes from 'prop-types';

// Import the components for bookmarks and history
import Bookmarks from './bookmarks';
import ReadingHistory from './history';

const MyFeed = ({ posts }) => (
  <div>
    <h1 className="text-3xl font-bold mb-6">My Feed</h1>
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
            layout="grid"
          />
        ))}
      </div>
    ) : (
      <p>No posts available.</p>
    )}
  </div>
);

MyFeed.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      thumbnail: PropTypes.string,
      created_at: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      upvotes: PropTypes.number.isRequired,
      downvotes: PropTypes.number.isRequired,
      comments_count: PropTypes.number.isRequired,
    })
  ).isRequired,
};

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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-grow" style={{ paddingTop: '4rem' }}> {/* Adjust paddingTop to match header height */}
        <Sidebar isAdmin={false} setIsSidebarOpen={setIsSidebarOpen} />
        <main className={`flex-grow p-8 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
          <Routes>
            <Route path="/" element={<MyFeed posts={posts} />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/history" element={<ReadingHistory />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

