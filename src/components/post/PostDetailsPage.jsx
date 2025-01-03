import { useState, useEffect } from 'react';
import PostCard from './PostCard';
import PostDetails from './PostDetails';

export default function PostDetailsPage() {
    const [posts, setPosts] = useState([]);
    const [selectedPostId, setSelectedPostId] = useState(null);

    useEffect(() => {
        // Fetch posts from your API
        async function fetchPosts() {
            try {
                const response = await fetch('http://localhost/devslog/server/get_user_posts.php');
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        }
        fetchPosts();
    }, []);

    const handlePostClick = (postId) => {
        setSelectedPostId(postId);
    };

    const handleClosePostDetails = () => {
        setSelectedPostId(null);
    };

    const handleVote = (postId, voteType, totalUpvotes, totalDownvotes) => {
        setPosts(prevPosts => prevPosts.map(post => 
            post.id === postId 
                ? { ...post, upvotes: totalUpvotes, downvotes: totalDownvotes }
                : post
        ));
    };
    return (
        <div>
            <h1>Posts</h1>
            {posts.map(post => (
                <PostCard
                    key={post.id}
                    {...post}
                    onClick={() => handlePostClick(post.id)}
                    onVote={handleVote}
                />
            ))}
            {selectedPostId && (
                <PostDetails
                    postId={selectedPostId}
                    onClose={handleClosePostDetails}
                    onVote={handleVote}
                />
            )}
        </div>
    );
}
