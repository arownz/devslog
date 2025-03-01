import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import PostCard from './post/PostCard';
import Footer from './Footer';

export default function SearchResults() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const loggedInUser = sessionStorage.getItem('user');
        const loggedInAdmin = sessionStorage.getItem('admin');

        if (!loggedInUser && !loggedInAdmin) {
            navigate('/');
            return;
        }

        setIsLoggedIn(!!(loggedInUser || loggedInAdmin));

        if (!query.trim()) {
            // If query is empty, redirect back to dashboard
            if (loggedInAdmin) {
                navigate('/admin-dashboard');
            } else {
                navigate('/user-dashboard');
            }
            return;
        }

        const fetchSearchResults = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost/devslog/server/search_posts.php?query=${encodeURIComponent(query)}`, {
                    credentials: 'include'
                });

                const data = await response.json();

                if (data.success) {
                    setPosts(data.posts);
                } else {
                    setError('No search results found');
                    // Optional: redirect after a timeout if no results
                    // setTimeout(() => navigate('/user-dashboard'), 3000);
                }
            } catch (error) {
                console.error('Error fetching search results:', error);
                setError('An error occurred while retrieving search results');
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query, navigate]);

    const handleVote = async (postId, voteType, upvotes, downvotes) => {
        setPosts(
            posts.map(post =>
                post.id === postId ? { ...post, upvotes, downvotes } : post
            )
        );
    };

    const handleBookmark = (postId, isBookmarked) => {
        setPosts(
            posts.map(post =>
                post.id === postId ? { ...post, isBookmarked } : post
            )
        );
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 pt-20">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Search Results</h1>
                        <p className="text-gray-600">
                            {loading ? 'Searching...' :
                                posts.length > 0 ? `Found ${posts.length} results for "${query}"` :
                                    `No results found for "${query}"`}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/user-dashboard')}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Back to All Posts
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map(post => (
                            <PostCard
                                key={post.id}
                                id={post.id}
                                image={post.thumbnail}
                                created_at={post.created_at}
                                author={post.author}
                                title={post.title}
                                upvotes={post.upvotes}
                                downvotes={post.downvotes}
                                comments={post.comments}
                                isLoggedIn={isLoggedIn}
                                onVote={handleVote}
                                onBookmark={handleBookmark}
                                isBookmarked={post.isBookmarked}
                                layout="grid"
                            />
                        ))}
                    </div>
                )}

                {!loading && posts.length === 0 && !error && (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <p className="mt-4 text-xl text-gray-600">No matching posts found</p>
                        <p className="text-gray-500 mb-8">Try adjusting your search terms</p>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}