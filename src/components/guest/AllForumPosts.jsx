import { useState, useEffect } from 'react';
import PostCard from "../post/PostCard";
import Header from "../Header";
import Footer from "../Footer";

export default function AllForumPosts() {
  const [forumPosts, setForumPosts] = useState([]);

  useEffect(() => {
    // Fetch forum posts from an API or load from a data source
    // For now, we'll use the static data
    setForumPosts([
      {
        id: 1,
        title: "10 Tips for Better React Performance",
        author: "Jane Doe",
        time: "5 mins ago",
        image: "https://th.bing.com/th?id=OIP.wqvuIBBlb9K6ULYuu31EEwHaDt&w=312&h=200&c=12&rs=1&qlt=99&o=6&dpr=1.3&pid=23.1",
        upvotes: 25,
        downvotes: 2,
        comments: 3,
        isBookmarked: false
      },
      // ... more posts ...
    ]);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">All Forum Posts</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {forumPosts.map((post) => (
            <PostCard
              key={post.id}
              {...post}
              isLoggedIn={false}
              onUpvote={() => { }}
              onDownvote={() => { }}
              onBookmark={() => { }}
              layout="grid"
            />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
