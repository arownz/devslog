import Footer from "../Footer";
import Header from "../Header";
import { Link } from 'react-router-dom';

export default function DevlogHome() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow pt-16">
        <section className="py-20 bg-gradient-to-b from-green-600 to-green-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">Welcome to Devslog</h1>
            <p className="text-xl mb-8">
              Join our vibrant community of developers sharing insights, tutorials, and resources.
            </p>
            <Link
              to="/signup"
              className="inline-block bg-white text-green-600 font-bold py-3 px-7 rounded-full hover:bg-gray-100 transition-colors duration-300"
            >
              Join Our Community
            </Link>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Trending Topics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">JavaScript Frameworks</h3>
                <p>Explore the latest trends and discussions around popular JavaScript frameworks like React, Vue, and Angular.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Web Development</h3>
                <p>Stay updated with the newest web development techniques and best practices.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">AI & Machine Learning</h3>
                <p>Join discussions on the impact of AI and machine learning in the tech industry.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Community Highlights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Top Contributors</h3>
                <p>Meet the top contributors who are actively sharing their knowledge and helping others.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Recent Discussions</h3>
                <p>Catch up on the latest discussions and debates happening in the community.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Get Involved</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">Share Your Knowledge</h3>
                <p>Post articles, tutorials, and resources to help others learn and grow.</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">Engage with Community</h3>
                <p>Comment on posts, upvote content, and connect with like-minded individuals.</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">Stay Updated</h3>
                <p>Follow topics and users to get the latest updates and insights.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
