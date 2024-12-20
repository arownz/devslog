import Header from './Header';
import Footer from './Footer';

const About = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow">
        <section className="py-20 bg-gradient-to-b from-blue-600 to-blue-800 text-white">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">About Devslog</h1>
            <p className="text-xl md:text-2xl text-center max-w-3xl mx-auto">
              Your daily source for developer insights, trends, and community-driven knowledge.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center">
              <div className="w-full md:w-1/2 mb-8 md:mb-0">
                <img 
                  src="https://img.freepik.com/free-vector/web-development-programmer-engineering-coding-website-augmented-reality-interface-screens-developer-project-engineer-programming-software-application-design-cartoon-illustration_107791-3863.jpg" 
                  alt="Developer illustration" 
                  className="rounded-lg shadow-xl"
                />
              </div>
              <div className="w-full md:w-1/2 md:pl-12">
                <h2 className="text-3xl font-bold mb-6">What is Devslog?</h2>
                <p className="text-lg mb-4">
                  Devslog is a cutting-edge platform designed for developers to share knowledge, stay updated with the latest tech trends, and connect with a global community of like-minded professionals.
                </p>
                <p className="text-lg mb-4">
                  Our mission is to empower developers with daily information, tutorials, and insights that matter in the fast-paced world of technology.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Devslog?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Daily Updates</h3>
                <p>Stay informed with fresh content every day, covering a wide range of development topics and technologies.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Community-Driven</h3>
                <p>Engage with a vibrant community of developers, share your knowledge, and learn from others&apos; experiences.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Diverse Content</h3>
                <p>From beginner tutorials to advanced techniques, find content that matches your skill level and interests.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Meet Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <img 
                  src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg" 
                  alt="Harold F. Pasion" 
                  className="w-32 h-32 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold">Harold F. Pasion</h3>
                <p className="text-gray-600">Full Stack Developer</p>
              </div>
              <div className="text-center">
                <img 
                  src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg" 
                  alt="Vhinz Neo Palaya" 
                  className="w-32 h-32 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold">Vhinz Neo Palaya</h3>
                <p className="text-gray-600">Front-end Developer</p>
              </div>
              <div className="text-center">
                <img 
                  src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg" 
                  alt="Rachelle Ann" 
                  className="w-32 h-32 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold">Rachelle Ann</h3>
                <p className="text-gray-600">Front-end Developer</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
