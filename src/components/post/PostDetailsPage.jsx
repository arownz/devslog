import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import PostCard from './PostCard';
import PostDetails from './PostDetails';
import { useDarkMode } from '../../hooks/useDarkMode';

export default function PostDetailsPage() {
    const { postId: urlPostId } = useParams();
    const [posts, setPosts] = useState([]);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isDarkMode } = useDarkMode();

    useEffect(() => {
        // If we have a post ID from URL, use it
        if (urlPostId) {
            const numericPostId = parseInt(urlPostId);
            if (!isNaN(numericPostId)) {
                setSelectedPostId(numericPostId);
            }
        }
        
        // Fetch posts from your API
        async function fetchPosts() {
            try {
                setLoading(true);
                const response = await fetch('http://localhost/devslog/server/get_all_posts.php');
                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error('Error fetching posts:', error);
                setError('Failed to load posts. Please try again later.');
            } finally {
                setLoading(false);
            }
        }
        fetchPosts();
    }, [urlPostId]);

    const handlePostClick = (postId) => {
        setSelectedPostId(postId);
        // Update URL without reloading
        window.history.pushState({}, '', `/posts/${postId}`);
    };

    const handleClosePostDetails = () => {
        setSelectedPostId(null);
        // Update URL without reloading
        window.history.pushState({}, '', '/posts');
    };

    const handleVote = (postId, voteType, totalUpvotes, totalDownvotes) => {
        setPosts(prevPosts => prevPosts.map(post => 
            post.id === postId 
                ? { ...post, upvotes: totalUpvotes, downvotes: totalDownvotes }
                : post
        ));
    };

    return (
        <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 pt-20">
                <h1 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    Posts
                </h1>
                
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                    </div>
                ) : error ? (
                    <div className={`p-4 rounded-md ${isDarkMode ? 'bg-red-900 text-red-100' : 'bg-red-100 text-red-700'}`}>
                        {error}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map(post => (
                            <PostCard
                                key={post.id}
                                {...post}
                                onClick={() => handlePostClick(post.id)}
                                onVote={handleVote}
                                isLoggedIn={true}
                                layout="grid"
                            />
                        ))}
                    </div>
                )}
                
                {selectedPostId && (
                    <PostDetails
                        postId={selectedPostId}
                        onClose={handleClosePostDetails}
                        onVote={handleVote}
                    />
                )}
            </main>
            <Footer />
        </div>
    );
}
