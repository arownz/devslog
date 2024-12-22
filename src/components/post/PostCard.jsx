import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link } from 'react-router-dom';

PostCard.propTypes = {
  id: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  upvotes: PropTypes.number.isRequired,
  downvotes: PropTypes.number.isRequired,
  comments: PropTypes.number.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  onUpvote: PropTypes.func.isRequired,
  onDownvote: PropTypes.func.isRequired,
  onBookmark: PropTypes.func.isRequired,
  isBookmarked: PropTypes.bool.isRequired,
};

export default function PostCard({ id, image, time, author, title, upvotes, downvotes, comments, isLoggedIn, onUpvote, onDownvote, onBookmark, isBookmarked }) {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleAction = (action) => {
    if (isLoggedIn) {
      action();
    } else {
      setShowLoginPrompt(true);
    }
  };
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={image || "https://placehold.co/600x400"}
        className="w-full h-48 object-cover"
        alt={title}
      />
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600 text-sm mb-4">
          <span className="text-green-700">{time}</span> by <span className="font-bold">{author}</span>
        </p>
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <button onClick={() => handleAction(onUpvote)} className="flex items-center text-gray-600 hover:text-green-500">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
              </svg>
              {upvotes}
            </button>
            <button onClick={() => handleAction(onDownvote)} className="flex items-center text-gray-600 hover:text-red-500">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
              {downvotes}
            </button>
            <Link to={`/posts/${id}`} className="flex items-center text-gray-600 hover:text-purple-500">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
              </svg>
              {comments}
            </Link>
          </div>
          <button onClick={() => handleAction(onBookmark)} className={`text-gray-600 hover:text-yellow-500 ${isBookmarked ? 'text-yellow-500' : ''}`}>
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
  );
}

