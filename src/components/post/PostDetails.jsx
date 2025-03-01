import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import { formatDistanceToNow } from 'date-fns';
import { FaArrowUp, FaArrowDown, FaBookmark, FaRegBookmark, FaComment } from 'react-icons/fa';
import { useDarkMode } from '../../hooks/useDarkMode';

export default function PostDetails({ postId, onClose, onVote, scrollToComments }) {
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [error, setError] = useState(null);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [userVote, setUserVote] = useState(null);
    const [loading, setLoading] = useState(true);
    const commentsRef = useRef(null);
    const { isDarkMode } = useDarkMode();

    const getLocalTime = (utcDateString) => {
        return new Date(utcDateString);
    };

    // Fetch post details
    useEffect(() => {
        const fetchPostDetails = async () => {
            if (!postId) return;
            
            setLoading(true);
            try {
                console.log("Fetching post details for ID:", postId);
                const response = await fetch(`http://localhost/devslog/server/get_post_details.php?id=${postId}`);
                
                if (!response.ok) {
                    throw new Error(`Server responded with ${response.status}`);
                }
                
                const data = await response.json();
                console.log("Post details response:", data);
                
                if (data.success) {
                    setPost(data.post);
                    setComments(data.comments || []);
                    setUserVote(data.userVote);
                } else {
                    setError(data.message || "Failed to fetch post details");
                }
            } catch (error) {
                console.error('Error fetching post details:', error);
                setError('An error occurred while fetching post details. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchPostDetails();
    }, [postId]);

    // Check bookmark status
    useEffect(() => {
        const checkBookmarkStatus = async () => {
            if (!postId) return;
            
            try {
                const response = await fetch(`http://localhost/devslog/server/check_bookmark.php?post_id=${postId}`, {
                    credentials: 'include',
                });
                const data = await response.json();
                if (data.success) {
                    setIsBookmarked(data.isBookmarked);
                }
            } catch (error) {
                console.error('Error checking bookmark status:', error);
            }
        };
        
        checkBookmarkStatus();
    }, [postId]);

    // Record history
    useEffect(() => {
        const recordHistory = async () => {
            if (!postId) return;

            try {
                await fetch('http://localhost/devslog/server/add_to_history.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `post_id=${postId}`,
                    credentials: 'include'
                });
            } catch (error) {
                console.error('Error recording history:', error);
            }
        };

        recordHistory();
    }, [postId]);

    // Scroll to comments if needed
    useEffect(() => {
        if (scrollToComments && commentsRef.current && !loading) {
            setTimeout(() => {
                commentsRef.current.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }, [scrollToComments, loading, comments]);

    const timeAgo = post ? formatDistanceToNow(getLocalTime(post.created_at), { addSuffix: true }) : 'Unknown time';

    const handleVote = async (voteType) => {
        try {
            const response = await fetch('http://localhost/devslog/server/vote_post.php', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `post_id=${postId}&vote_type=${voteType}`,
            });

            const data = await response.json();

            if (data.success) {
                setPost(prevPost => ({
                    ...prevPost,
                    upvotes: data.totalUpvotes,
                    downvotes: data.totalDownvotes
                }));
                setUserVote(prevVote => prevVote === voteType ? null : voteType);
                
                if (onVote) {
                    onVote(postId, voteType, data.totalUpvotes, data.totalDownvotes);
                }
            } else {
                console.error('Vote failed:', data.message);
            }
        } catch (error) {
            console.error('Error voting:', error);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        
        try {
            const response = await fetch('http://localhost/devslog/server/add_comment.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `post_id=${postId}&content=${encodeURIComponent(newComment)}`,
                credentials: 'include',
            });

            const data = await response.json();

            if (data.success) {
                setComments(prevComments => [...prevComments, data.comment]);
                setNewComment('');
            } else {
                setError(data.message);
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            setError('Failed to add comment. Please try again later.');
        }
    };

    const handleBookmark = async () => {
        try {
            const response = await fetch(`http://localhost/devslog/server/${isBookmarked ? 'remove_bookmark' : 'add_bookmark'}.php`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `post_id=${postId}`,
            });

            const data = await response.json();

            if (data.success) {
                setIsBookmarked(!isBookmarked);
            } else {
                console.error('Bookmark action failed:', data.message);
            }
        } catch (error) {
            console.error('Error performing bookmark action:', error);
        }
    };

    const defaultImage = 'https://via.placeholder.com/150';

    if (loading) {
        return (
            <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50`}>
                <div className={`p-8 rounded-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                    <p className={`mt-4 text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Loading post...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                <div className={`p-8 rounded-md ${isDarkMode ? 'bg-red-900 text-white' : 'bg-red-100 text-red-700'}`}>
                    <p className="text-lg font-bold mb-2">Error</p>
                    <p>{error}</p>
                    <button 
                        onClick={onClose}
                        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                <div className={`p-8 rounded-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                    <p>Post not found</p>
                    <button 
                        onClick={onClose}
                        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={onClose}>
            <div className={`relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-200'}`} onClick={(e) => e.stopPropagation()}>
                <div className="p-6 md:p-8 max-h-[80vh] overflow-y-auto">
                    <div className="flex flex-col md:flex-row">
                        <div className="flex flex-row md:flex-col items-center md:items-start mb-4 md:mb-0 md:mr-6 space-x-4 md:space-x-0 md:space-y-2">
                            <button
                                onClick={() => handleVote('upvote')}
                                className={`focus:outline-none ${userVote === 'upvote' ? 'text-green-500' : isDarkMode ? 'text-gray-400 hover:text-green-400' : 'text-gray-400 hover:text-green-500'}`}
                            >
                                <FaArrowUp size={24} />
                            </button>
                            <span className={`font-bold text-lg ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                {post.upvotes - post.downvotes}
                            </span>
                            <button
                                onClick={() => handleVote('downvote')}
                                className={`focus:outline-none ${userVote === 'downvote' ? 'text-red-500' : isDarkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-400 hover:text-red-500'}`}
                            >
                                <FaArrowDown size={24} />
                            </button>
                        </div>

                        <div className="flex-grow">
                            <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                {post.title}
                            </h2>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-4`}>
                                Posted by <span className="font-medium">{post.author}</span> {timeAgo}
                            </p>
                            <div className="mb-4 flex justify-center">
                                <img
                                    src={post.thumbnail ? `data:image/jpeg;base64,${post.thumbnail}` : defaultImage}
                                    alt={post.title}
                                    className="max-w-full h-auto rounded-lg object-cover"
                                    style={{ maxHeight: '400px' }}
                                />
                            </div>
                            <div className={`prose max-w-none mb-4 ${isDarkMode ? 'prose-invert' : ''}`}>
                                <ReactQuill value={post.content} readOnly={true} theme="bubble" />
                            </div>
                            <div className="flex items-center space-x-4 mt-4">
                                <button 
                                    onClick={handleBookmark} 
                                    className={`flex items-center ${isDarkMode ? 'text-gray-300 hover:text-yellow-400' : 'text-gray-500 hover:text-yellow-500'} focus:outline-none`}
                                >
                                    {isBookmarked ? <FaBookmark size={18} /> : <FaRegBookmark size={18} />}
                                    <span className="ml-1">Bookmark</span>
                                </button>
                                <div className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                    <FaComment size={18} />
                                    <span className="ml-1">{comments.length} Comments</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8" ref={commentsRef}>
                        <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            Comments
                        </h3>
                        <div className="mb-4">
                            <textarea
                                className={`w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
                                placeholder="What are your thoughts?"
                                rows="4"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <button
                                onClick={handleAddComment}
                                className="mt-2 bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                                Comment
                            </button>
                        </div>
                        
                        {comments.length > 0 ? (
                            comments.map(comment => (
                                <div 
                                    key={comment.id} 
                                    className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4 mb-4 flex items-start`}
                                >
                                    <div className="flex-shrink-0 mr-4">
                                        {comment.profile_image ? (
                                            <img
                                                src={comment.profile_image.startsWith('data:image')
                                                    ? comment.profile_image
                                                    : `data:image/jpeg;base64,${comment.profile_image}`}
                                                alt={`${comment.username}'s profile`}
                                                className="w-10 h-10 rounded-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = defaultImage;
                                                }}
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                <span className="text-gray-600 font-medium">
                                                    {comment.username ? comment.username[0].toUpperCase() : 'U'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex items-center mb-1">
                                            <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} mr-2`}>
                                                {comment.username || 'Anonymous'}
                                            </p>
                                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                            </p>
                                        </div>
                                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {comment.content}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className={`text-center py-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                No comments yet. Be the first to comment!
                            </div>
                        )}
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className={`absolute top-4 right-4 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'} focus:outline-none`}
                >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

PostDetails.propTypes = {
    postId: PropTypes.number.isRequired,
    onClose: PropTypes.func.isRequired,
    onVote: PropTypes.func,
    scrollToComments: PropTypes.bool
};

PostDetails.defaultProps = {
    scrollToComments: false,
    onVote: () => {}
};
