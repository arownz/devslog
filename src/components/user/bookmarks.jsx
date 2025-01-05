import { useState, useEffect } from 'react';
import PostCard from '../post/PostCard';

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBookmarks() {
      try {
        const response = await fetch('http://localhost/devslog/server/get_bookmarks.php', {
          credentials: 'include',
        });
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        const text = await response.text();
        console.log('Raw server response:', text);
        let data;
        try {
          data = JSON.parse(text);
          console.log('Parsed data:', data);
        } catch (e) {
          console.error('Invalid JSON:', text);
          throw new Error('Server returned invalid JSON');
        }
        if (data.success) {
          setBookmarks(data.bookmarks);
        } else {
          setError(data.message || 'Failed to fetch bookmarks');
        }
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
        setError('An error occurred while fetching bookmarks');
      }
    }

    fetchBookmarks();
  }, []);

  const handleBookmark = (postId, isBookmarked) => {
    if (!isBookmarked) {
      setBookmarks(bookmarks.filter(bookmark => bookmark.id !== postId));
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div>
      <h1>Your Bookmarks</h1>
      {bookmarks.length === 0 ? (
        <p>You have no bookmarks yet.</p>
      ) : (
        bookmarks.map(post => (
          <PostCard
            key={post.id}
            {...post}
            isBookmarked={true}
            onBookmark={handleBookmark}
            isLoggedIn={true}
            layout="vertical"
          />
        ))
      )}
    </div>
  );
}

