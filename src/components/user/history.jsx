import { useState, useEffect } from 'react';
import PostCard from '../post/PostCard';

export default function History() {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await fetch('http://localhost/devslog/server/get_reading_history.php', {
                credentials: 'include'
            });
            const data = await response.json();
            
            if (data.success) {
                setHistory(data.history);
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError('Failed to fetch reading history');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div>Loading history...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Reading History</h1>
            {history.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {history.map((post) => (
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
                            isLoggedIn={true}
                            layout="grid"
                        />
                    ))}
                </div>
            ) : (
                <p>No reading history found.</p>
            )}
        </div>
    );
}