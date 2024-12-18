import { useState } from 'react';
import { Link } from 'react-router-dom';
import BlogCard from "./PostCard";
import Header from "../Header";
import Footer from "../Footer";

export default function Blogs() {
  const [blogPosts, setBlogPosts] = useState([
    {
      id: 1,
      title: "10 Tips for Better React Performance",
      author: "Jane Doe",
      date: "2023-05-15",
      image: "https://th.bing.com/th?id=OIP.wqvuIBBlb9K6ULYuu31EEwHaDt&w=312&h=200&c=12&rs=1&qlt=99&o=6&dpr=1.3&pid=23.1",
      tags: ["React", "Performance"],
      category: "Frontend",
      time: "5 min read",
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
      tags: ["TypeScript", "JavaScript"],
      category: "Programming",
      time: "8 min read",
      likes: 20,
      comments: 5,
      upvotes: 30
    },
    {
      id: 2,
      title: "Getting Started with React",
      author: "John Smith",
      date: "2023-05-10",
      image: "https://th.bing.com/th?id=OIP.ORYCDafreIYhtQfCY0B0NAHaFg&w=312&h=200&c=12&rs=1&o=6&dpr=1.3&pid=23.1",
      tags: ["TypeScript", "JavaScript"],
      category: "Programming",
      time: "8 min read",
      likes: 20,
      comments: 5,
      upvotes: 30
    },
    {
      id: 2,
      title: "Getting Started with React",
      author: "John Smith",
      date: "2023-05-10",
      image: "https://th.bing.com/th?id=OIP.ORYCDafreIYhtQfCY0B0NAHaFg&w=312&h=200&c=12&rs=1&o=6&dpr=1.3&pid=23.1",
      tags: ["TypeScript", "JavaScript"],
      category: "Programming",
      time: "8 min read",
      likes: 20,
      comments: 5,
      upvotes: 30
    },
    
    // Add more blog posts as needed
  ]);

  const helpfulResources = [
    {
      title: "Wix Studio Templates",
      description: "Sell your Studio templates in the Marketplace to earn hands-off income for your business.",
      image: "https://designshack.net/wp-content/uploads/Elegant-Personal-Wix-Blog-Template-1024x881.jpg",
      url: "https://www.wix.com/studio/templates"
    },
    {
      title: "MDN Web Docs",
      description: "Comprehensive resources for web developers",
      image: "https://i.ytimg.com/vi/kdnlUDvqgQk/maxresdefault.jpg",
      url: "https://developer.mozilla.org/"
    },
    // Add more resources as needed
  ];

  const handleLike = (postId) => {
    setBlogPosts(posts => posts.map(post =>
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  const handleUpvote = (postId) => {
    setBlogPosts(posts => posts.map(post =>
      post.id === postId ? { ...post, upvotes: post.upvotes + 1 } : post
    ));
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">All Forum Posts</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <section className="w-full lg:w-2/3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <BlogCard {...post} />
                  <div className="p-4 flex justify-between items-center border-t">
                    <button onClick={() => handleLike(post.id)} className="flex items-center text-gray-600 hover:text-blue-500">
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                      </svg>
                      {post.likes}
                    </button>
                    <button onClick={() => handleUpvote(post.id)} className="flex items-center text-gray-600 hover:text-green-500">
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                      </svg>
                      {post.upvotes}
                    </button>
                    <Link to={`/blog/${post.id}`} className="flex items-center text-gray-600 hover:text-purple-500">
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
          <aside className="w-full lg:w-1/3">
            <h2 className="text-2xl font-bold mb-4">Helpful Resources</h2>
            <div className="space-y-4">
              {helpfulResources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <img src={resource.image} alt={resource.title} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
                    <p className="text-gray-600">{resource.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}