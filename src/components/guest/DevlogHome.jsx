import PostCard from "../post/PostCard";
import Footer from "../Footer";
import Header from "../Header";
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function DevlogHome() {
  // Sample data for featured blog posts
  const [featuredPosts, setFeaturedPosts] = useState([
    {
      id: 1,
      title: "10 Tips for Better React Performance",
      author: "Jane Doe",
      date: "2023-05-15",
      image: "https://th.bing.com/th?id=OIP.wqvuIBBlb9K6ULYuu31EEwHaDt&w=312&h=200&c=12&rs=1&qlt=99&o=6&dpr=1.3&pid=23.1",
      time: "8 mins ago",
      likes: 15,
      comments: 3,
      upvotes: 25
    },
    {
      id: 2,
      title: "Getting Started with React",
      author: "John Smith",
      date: "2023-05-10",
      image: "https://th.bing.com/th?id=OIP.ORYCDafreIYhtQfCY0B0NAHaFg&w=312&h=200&c=12&rs=1&o=6&dpr=1.3&pid=23.1",
      time: "5 hrs ago",
      likes: 20,
      comments: 5,
      upvotes: 30
    },
    // Add more forum static posts as needed
  ]);

  const handleUpvote = (postId) => {
    setFeaturedPosts(posts => posts.map(post =>
      post.id === postId ? { ...post, upvotes: post.upvotes + 1 } : post
    ));
  };

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
        <div className="flex flex-col lg:flex-row gap-8">
          <section className="flex flex-col w-full lg:w-[100%]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {featuredPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <PostCard {...post} />
                  <div className="p-4 flex justify-between items-center border-t">

                    <button onClick={() => handleUpvote(post.id)} className="flex items-center text-gray-600 hover:text-green-500">
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                      </svg>
                      {post.upvotes}
                    </button>
                    <Link to={`/posts/${post.id}`} className="flex items-center text-gray-600 hover:text-purple-500">
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                      </svg>
                      {post.comments}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
