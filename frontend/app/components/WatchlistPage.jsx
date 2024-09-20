'use client';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function WatchlistPage() {
    const { data: session, status } = useSession();
    const [watchlists, setWatchlists] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (session) {
            fetchWatchlists();
        }
    }, [session]);

    const fetchWatchlists = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/watchlists', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${session.accessToken}`, // Include token in Authorization header
                },
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail);
            }

            const data = await res.json();
            setWatchlists(data); // Set the watchlists in state
        } catch (error) {
            setError(error.message);
        }
    };

    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h2>{session?.username}'s Watchlists</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {watchlists.map(watchlist => (
                    <li key={watchlist.id}>{watchlist.name}</li>
                ))}
            </ul>
        </div>
    );
}
