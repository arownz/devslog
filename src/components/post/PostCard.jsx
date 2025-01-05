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
  comments, // Ensure this prop is passed correctly
  isLoggedIn,
  onBookmark,
  isBookmarked,
  layout,
  onClick,
  onVote
}) {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [localUpvotes, setLocalUpvotes] = useState(upvotes);
  const [localDownvotes, setLocalDownvotes] = useState(downvotes);

  const getLocalTime = (utcDateString) => {
    const date = new Date(utcDateString);
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
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
        setLocalUpvotes(data.totalUpvotes);
        setLocalDownvotes(data.totalDownvotes);
        onVote(id, voteType, data.totalUpvotes, data.totalDownvotes);
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

  const handleCommentClick = (e) => {
    e.stopPropagation();
    setShowDetails(true);
    onClick && onClick(id);
    setTimeout(() => {
      const commentsSection = document.getElementById('comments-section');
      if (commentsSection) {
        commentsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    onBookmark(id);
  };

  return (
    <>
      <article className={cardClass} onClick={handleCardClick}>
        <img
          src={`data:image/jpeg;base64,${image}`}
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
                onClick={handleCommentClick}
                className="flex items-center text-gray-600 hover:text-purple-500"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                </svg>
                <span>{comments}</span> {/* Display comments count */}
              </button>

            </div>
            <button onClick={handleBookmark} className={`text-gray-600 hover:text-yellow-500 ${isBookmarked ? 'text-yellow-500' : ''}`}>
              <svg className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
          scrollToComments={true}
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
  upvotes: PropTypes.number.isRequired,
  downvotes: PropTypes.number.isRequired,
  onVote: PropTypes.func.isRequired,
  comments: PropTypes.number.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  onBookmark: PropTypes.func.isRequired,
  isBookmarked: PropTypes.bool.isRequired,
  layout: PropTypes.oneOf(['grid', 'vertical']).isRequired,
  onClick: PropTypes.func,
};

