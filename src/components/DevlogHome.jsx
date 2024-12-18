import BlogCard from "./post/PostCard";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { Link } from 'react-router-dom';

export default function DevlogHome() {
  // Sample data for featured blog posts
  const featuredPosts = [
    {
      title: "10 Tips for Better React Performance",
      author: "Jane Doe",
      date: "2023-05-15",
      image: "https://th.bing.com/th?id=OIP.wqvuIBBlb9K6ULYuu31EEwHaDt&w=312&h=200&c=12&rs=1&qlt=99&o=6&dpr=1.3&pid=23.1",
      tags: ["React", "Performance"],
      category: "Frontend",
      time: "5 min read"
    },
    {
      title: "Getting Started with React",
      author: "John Smith",
      date: "2023-05-10",
      image: "https://th.bing.com/th?id=OIP.ORYCDafreIYhtQfCY0B0NAHaFg&w=312&h=200&c=12&rs=1&o=6&dpr=1.3&pid=23.1",
      tags: ["TypeScript", "JavaScript"],
      category: "Programming",
      time: "8 min read"
    },
    {
      title: "The Future of Web Development",
      author: "Alice Johnson",
      date: "2023-05-05",
      image: "https://www.appletechsoft.com/wp-content/uploads/2023/01/The-Future-of-Web-Development-Emerging-Trends-and-Technologies.png",
      tags: ["Web Development", "Trends"],
      category: "Industry",
      time: "6 min read"
    },
  ];

  // Sample data for helpful resources
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
    { 
      title: "FreeCodeCamp", 
      description: "Learn to code for free", 
      image: "https://www.i-programmer.info/images/stories/News/2016/April/B/freecodecamp1.jpg",
      url: "https://www.freecodecamp.org/"
    },
  ];
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
        <div className="flex flex-col lg:flex-row gap-5">
          <section className="flex flex-col w-full lg:w-[70%]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredPosts.map((post, index) => (
                <BlogCard key={index} {...post} />
              ))}
            </div>
            <button className="flex items-center justify-center gap-3 py-2 px-6 mt-8 text-xl font-bold text-black border-green-700 border-solid border-2 rounded-full shadow-md hover:bg-green-100 transition-colors duration-300">
              View All Blog Posts
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </section>
          <aside className="flex flex-col w-full lg:w-[30%] mt-8 lg:mt-0" role="complementary">
            <h2 className="text-3xl font-bold mb-6">Helpful Resources</h2>
            <div className="space-y-6">
              {helpfulResources.map((resource, index) => (
                <a 
                  key={index} 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block bg-emerald-100 border border-green-300 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="bg-emerald-100 border border-green-300 rounded-lg overflow-hidden">
                    <img src={resource.image} alt={resource.title} className="w-full h-40 object-cover" />
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
                      <p className="text-gray-600">{resource.description}</p>
                    </div>
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
