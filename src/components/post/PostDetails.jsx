import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import { formatDistanceToNow } from 'date-fns';
import { FaArrowUp, FaArrowDown, FaBookmark, FaRegBookmark, FaComment } from 'react-icons/fa';

export default function PostDetails({ postId, onClose, onVote }) {
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [error, setError] = useState(null);
    const [isBookmarked, setIsBookmarked] = useState(false);

    const getLocalTime = (utcDateString) => {
        const date = new Date(utcDateString);
        return new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    };

    const timeAgo = post ? formatDistanceToNow(getLocalTime(post.created_at), { addSuffix: true }) : 'Unknown time';

    async function fetchPostDetails() {
        try {
            console.log('Fetching post details for postId:', postId);
            const response = await fetch(`http://localhost/devslog/server/get_post_details.php?id=${postId}`);
            const data = await response.json();
            console.log('Received data:', data);
            if (data.success) {
                setPost(data.post);
                setComments(data.comments);
            } else {
                console.error('Failed to fetch post details:', data.message);
                setError(data.message);
            }
        } catch (error) {
            console.error('Error fetching post details:', error);
            setError('Failed to fetch post details. Please try again later.');
        }
    }

    useEffect(() => {
        fetchPostDetails();
    }, [postId]);

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
                onVote(postId, voteType, data.totalUpvotes, data.totalDownvotes);
            } else {
                console.error('Vote failed:', data.message);
            }
        } catch (error) {
            console.error('Error voting:', error);
        }
    };

    const handleAddComment = async () => {
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



    const handleBookmark = () => {
        // TODO: Implement bookmark functionality
        setIsBookmarked(!isBookmarked);
        console.log('Bookmark');
    };

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={onClose}>
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 md:p-8 max-h-[90vh] overflow-y-auto">
                    <div className="flex flex-col md:flex-row">
                        <div className="flex flex-row md:flex-col items-center md:items-start mb-4 md:mb-0 md:mr-6 space-x-4 md:space-x-0 md:space-y-2">
                            <button onClick={() => handleVote('upvote')} className="text-gray-400 hover:text-green-500 focus:outline-none">
                                <FaArrowUp size={24} />
                            </button>
                            <span className="font-bold text-lg">{post.upvotes - post.downvotes}</span>
                            <button onClick={() => handleVote('downvote')} className="text-gray-400 hover:text-red-500 focus:outline-none">
                                <FaArrowDown size={24} />
                            </button>
                        </div>
                        <div className="flex-grow">
                            <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
                            <p className="text-sm text-gray-500 mb-4">
                                Posted by <span className="font-medium">{post.author}</span> {timeAgo}
                            </p>
                            <div className="mb-4 flex justify-center">
                                <img
                                    src={`data:image/jpeg;base64,${post.thumbnail}`}
                                    alt={post.title}
                                    className="max-w-full h-auto rounded-lg object-cover"
                                    style={{ maxHeight: '400px' }}
                                />
                            </div>
                            <div className="prose max-w-none mb-4">
                                <ReactQuill value={post.content} readOnly={true} theme="bubble" />
                            </div>
                            <div className="flex items-center space-x-4 mt-4">
                                <button onClick={handleBookmark} className="flex items-center text-gray-500 hover:text-yellow-500 focus:outline-none">
                                    {isBookmarked ? <FaBookmark size={18} /> : <FaRegBookmark size={18} />}
                                    <span className="ml-1">Bookmark</span>
                                </button>
                                <div className="flex items-center text-gray-500">
                                    <FaComment size={18} />
                                    <span className="ml-1">{comments.length} Comments</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8">
                        <h3 className="text-xl font-bold mb-4">Comments</h3>
                        <div className="mb-4">
                            <textarea
                                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="What are your thoughts?"
                                rows="4"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <button
                                onClick={handleAddComment}
                                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Comment
                            </button>
                        </div>
                        {comments.map(comment => (
                            <div key={comment.id} className="bg-gray-50 rounded-lg p-4 mb-4 flex items-start">
                                {comment.profile_image ? (
                                    <img
                                        src={comment.profile_image.startsWith('data:image') 
                                            ? comment.profile_image 
                                            : `data:image/jpeg;base64,${comment.profile_image}`}
                                        alt={`${comment.username}'s profile`}
                                        className="w-10 h-10 rounded-full mr-4 object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full mr-4 bg-gray-300 flex items-center justify-center">
                                        <span className="text-gray-600 font-medium">
                                            {comment.username ? comment.username[0].toUpperCase() : 'P'}
                                        </span>
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{comment.username}</p>
                                    <p className="text-xs text-gray-500 mb-2">{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</p>
                                    <p className="text-gray-700">{comment.content}</p>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
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
    onVote: PropTypes.func.isRequired,
};
