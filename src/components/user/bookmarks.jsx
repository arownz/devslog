import { useState, useEffect } from 'react';
import PostCard from '../post/PostCard';

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const response = await fetch('http://localhost/devslog/server/get_bookmarks.php', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setBookmarks(data.bookmarks);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to fetch bookmarks');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmarkToggle = async (postId, isBookmarked) => {
    // Implement bookmark toggle logic here
    // This should update the server and then refresh the bookmarks
    // For now, we'll just remove the bookmark from the local state
    if (!isBookmarked) {
      setBookmarks(bookmarks.filter(bookmark => bookmark.id !== postId));
    }
  };

  if (isLoading) return <div>Loading bookmarks...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Bookmarks</h1>
      {bookmarks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bookmarks.map((bookmark) => (
            <PostCard
              key={bookmark.id}
              id={bookmark.id}
              image={bookmark.thumbnail}
              created_at={bookmark.created_at}
              author={bookmark.author}
              title={bookmark.title}
              upvotes={bookmark.upvotes}
              downvotes={bookmark.downvotes}
              comments={bookmark.comments}
              isLoggedIn={true}
              isBookmarked={true}
              onBookmark={handleBookmarkToggle}
              layout="grid"
            />
          ))}
        </div>
      ) : (
        <p>No bookmarks found.</p>
      )}
    </div>
  );
}


