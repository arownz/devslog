import { useState, useEffect } from 'react';
import PostCard from '../post/PostCard';

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    async function fetchBookmarks() {
      try {
        const response = await fetch('http://localhost/devslog/server/get_bookmarks.php', {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          setBookmarks(data.bookmarks);
        } else {
          console.error('Failed to fetch bookmarks:', data.message);
        }
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
      }
    }
    fetchBookmarks();
  }, []);

  return (
    <div>
      <h1>Your Bookmarks</h1>
      {bookmarks.map(post => (
        <PostCard
          key={post.id}
          {...post}
          isBookmarked={true}
          onBookmark={() => setBookmarks(bookmarks.filter(b => b.id !== post.id))}
        />
      ))}
    </div>
  );
}

