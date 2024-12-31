import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { formatDistanceToNow } from 'date-fns';

export default function PostDetails({ postId, onClose }) {
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
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

        fetchPostDetails();
    }, [postId]);

    const handleAddComment = async () => {
        // TODO: Implement add comment functionality
        console.log('Add comment:', newComment);
    };

    const handleUpvote = () => {
        // TODO: Implement upvote functionality
        console.log('Upvote');
    };

    const handleDownvote = () => {
        // TODO: Implement downvote functionality
        console.log('Downvote');
    };

    const handleBookmark = () => {
        // TODO: Implement bookmark functionality
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
                <div className="mt-3 text-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{post.title}</h3>

                    <p className="text-gray-600 text-sm mb-4">
                        <span className="text-green-700">{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span> by <span className="font-bold">{post.author}</span>
                    </p>
                    <div className="mt-2 text-left">
                        <img src={`data:image/jpeg;base64,${post.thumbnail}`} alt={post.title} className="w-full h-auto mb-4" />
                        <ReactQuill
                            value={post.content}
                            readOnly={true}
                            theme="bubble"
                        />
                        <div className="flex justify-between items-center mt-4">
                            <button onClick={handleUpvote} className="text-gray-600 hover:text-green-500">Upvote ({post.upvotes})</button>
                            <button onClick={handleDownvote} className="text-gray-600 hover:text-red-500">Downvote ({post.downvotes})</button>
                            <button onClick={handleBookmark} className="text-gray-600 hover:text-yellow-500">Bookmark</button>
                        </div>
                        <div className="mt-4">
                            <h4 className="text-md font-semibold">Comments</h4>
                            {comments.map(comment => (
                                <div key={comment.id} className="border-b border-gray-200 py-2">
                                    <p className="text-sm">{comment.content}</p>
                                    <p className="text-xs text-gray-500">by {comment.author} - {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</p>
                                </div>
                            ))}
                            <div className="mt-2">
                                <textarea
                                    className="w-full border rounded p-2"
                                    placeholder="Add a comment..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />
                                <button onClick={handleAddComment} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">Add Comment</button>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4">Close</button>
                </div>
            </div>
        </div>
    );
}

PostDetails.propTypes = {
    postId: PropTypes.number.isRequired,
    onClose: PropTypes.func.isRequired,
};

