import PostCard from "../post/PostCard";
import Footer from "../Footer";
import Header from "../Header";
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function DevlogHome() {
  const [featuredPosts, setFeaturedPosts] = useState([]);

  useEffect(() => {
    // Fetch featured posts from the server
    // For now, we'll use dummy data
    setFeaturedPosts(
      [
      { id: 1, title: "10 Tips for Better React Performance", author: "Jane Doe", time: "8 mins ago", image: "https://placehold.co/600x400", upvotes: 25, downvotes: 2, comments: 3, isBookmarked: false },
      
      [{ id: 2, title: "10 Tips for Better React Performance", author: "Jane Doe", time: "8 mins ago", image: "https://placehold.co/600x400", upvotes: 25, downvotes: 2, comments: 3, isBookmarked: false },
          ]
    ]);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
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
        <div className="flex flex-col gap-8">
          {featuredPosts.map((post) => (
            <PostCard
              key={post.id}
              {...post}
              isLoggedIn={false}
              onUpvote={() => { }}
              onDownvote={() => { }}
              onBookmark={() => { }}
            />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}