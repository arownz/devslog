import PostCard from "../post/PostCard";
import Footer from "../Footer";
import Header from "../Header";
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ErrorBoundary from '../ErrorBoundary';

export default function DevlogHome() {
  const [featuredPosts, setFeaturedPosts] = useState([]);

  useEffect(() => {
    // Fetch featured posts from the XAMPP database
    // For now, we'll use dummy data
    setFeaturedPosts([
      {
        id: 1,
        title: "10 Tips for Better React Performance",
        author: "Jane Doe",
        created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
        image: "https://dsad.com/wp-content/uploads/2017/01/DSADWheelofFortune.jpg",
        upvotes: 25,
        downvotes: 2,
        comments: 3,
        isBookmarked: false
      },
      // ... more posts ...
    ].slice(0, 5)); // Limit to 5 posts
  }, []);


  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <ErrorBoundary>
        <main className="flex-grow container mx-auto px-4 py-8">
        <section className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Featured Forum Posts</h1>
          <p className="text-xl text-gray-600">
            Browse through all developers articles, tutorials, resources, and more!
          </p>
          <Link
            to="/signup"
            className="inline-block bg-green-600 text-white font-bold py-3 px-7 rounded-full hover:bg-green-700 transition-colors duration-300 mb-3 mt-6"
          >
            Start Sharing Knowledge
          </Link>
        </section>
        <div className="space-y-6">
          {featuredPosts.map((post) => (
            <PostCard
              key={post.id}
              {...post}
              isLoggedIn={false}
              onUpvote={() => {}}
              onDownvote={() => {}}
              onBookmark={() => {}}
              layout="vertical"
            />
          ))}

        </div>

      </main>
      </ErrorBoundary>
      <Footer />
    </div>

  );
}