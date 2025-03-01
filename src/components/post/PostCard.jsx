import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import PostDetails from './PostDetails';
import { formatDistanceToNow } from 'date-fns';

export default function PostCard({
  id,
  image,
  created_at,
  author,
  title,
  upvotes,
  downvotes,
  onVote,
  comments,
  isLoggedIn,
  onBookmark,
  isBookmarked,
  layout,
  onClick,
}) {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [localUpvotes, setLocalUpvotes] = useState(upvotes || 0);
  const [localDownvotes, setLocalDownvotes] = useState(downvotes || 0);
  const [localIsBookmarked, setLocalIsBookmarked] = useState(isBookmarked);

  // Add this function to handle undefined image
  const getImageSrc = () => {
    if (image && image !== 'default-image-url.jpg') {
      return `data:image/jpeg;base64,${image}`;
    }
  };
  const getLocalTime = (utcDateString) => {
    // Just create a date object - JavaScript will automatically handle the timezone conversion
    return new Date(utcDateString);
  };

  const timeAgo = created_at
    ? formatDistanceToNow(getLocalTime(created_at), { addSuffix: true })
    : 'Unknown time';

  const handleVote = async (e, voteType) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }
    try {
      const response = await fetch('http://localhost/devslog/server/vote_post.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `post_id=${id}&vote_type=${voteType}`,
      });

      const data = await response.json();

      if (data.success) {
        setLocalUpvotes(data.upvotes);
        setLocalDownvotes(data.downvotes);
        if (onVote) {
          onVote(id, voteType, data.upvotes, data.downvotes);
        }
      } else {
        console.error('Vote failed:', data.message);
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const cardClass = layout === 'grid'
    ? "bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
    : "bg-white rounded-lg shadow-md overflow-hidden flex mb-4 cursor-pointer";

  const imageClass = layout === 'grid'
    ? "w-full h-48 object-cover"
    : "w-1/4 h-auto object-cover";

  const contentClass = layout === 'grid'
    ? "p-6"
    : "p-6 w-3/4";

  const handleCardClick = () => {
    setShowDetails(true);
    onClick && onClick(id);
  };

  const handleBookmark = async (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }
    try {
      const response = await fetch(`http://localhost/devslog/server/${isBookmarked ? 'remove_bookmark' : 'add_bookmark'}.php`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `post_id=${id}`,
      });

      const data = await response.json();

      if (data.success) {
        const newBookmarkState = !isBookmarked;
        setLocalIsBookmarked(newBookmarkState);
        if (onBookmark) {
          onBookmark(id, newBookmarkState);
        }
      } else {
        console.error('Bookmark action failed:', data.message);
      }
    } catch (error) {
      console.error('Error performing bookmark action:', error);
    }
  };

  return (
    <>
      <article className={cardClass} onClick={handleCardClick}>
        <img
          src={getImageSrc()}
          className={imageClass}
          alt={title}
        />

        <div className={contentClass}>  
          <h2 className="text-xl font-semibold mb-2">{title}</h2>
          <p className="text-gray-600 text-sm mb-4">
            <span className="text-green-700">{timeAgo}</span> by <span className="font-bold">{author}</span>
          </p>
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <button onClick={(e) => handleVote(e, 'upvote')} className="flex items-center text-gray-600 hover:text-green-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                </svg>
              </button>
              <span className="text-gray-600">{localUpvotes - localDownvotes}</span>
              <button onClick={(e) => handleVote(e, 'downvote')} className="flex items-center text-gray-600 hover:text-red-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleCardClick(); }}
                className="flex items-center text-gray-600 hover:text-purple-500"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                </svg>
                <span>{comments}</span> {/* Display comments count which still not working */}
              </button>
            </div>
            {/* Bookmark icon button */}
            <button onClick={handleBookmark} className={`text-gray-600 hover:text-yellow-500 ${localIsBookmarked ? 'text-yellow-500' : ''}`}>
              <svg className="w-5 h-5" fill={localIsBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
              </svg>
            </button>
          </div>
        </div>
        {showLoginPrompt && (
          <div className="p-4 bg-yellow-100 text-yellow-800">
            Please <Link to="/signin" className="font-bold underline">log in</Link> to perform this action.
          </div>
        )}
      </article>
      {showDetails && (
        <PostDetails
          postId={id}
          onClose={() => setShowDetails(false)}
          scrollToComments={false} // Ensure it doesn't scroll to comments
          upvotes={localUpvotes}
          downvotes={localDownvotes}
          onVote={handleVote}
        />
      )}
    </>
  );
}

PostCard.propTypes = {
  id: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  created_at: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  upvotes: PropTypes.number,
  downvotes: PropTypes.number,
  onVote: PropTypes.func,
  comments: PropTypes.number,
  isLoggedIn: PropTypes.bool.isRequired,
  onBookmark: PropTypes.func,
  isBookmarked: PropTypes.bool,
  layout: PropTypes.oneOf(['grid', 'vertical']).isRequired,
  onClick: PropTypes.func,
};

