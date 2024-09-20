'use client';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Watchlist from './Watchlist';
import { type } from 'os';

export default function WatchlistPage() {
    const { data: session, status } = useSession();
    const [watchlists, setWatchlists] = useState([]);
    const [error, setError] = useState(null);

    const [movieID, setMovieID] = useState(""); // can remove later

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

    const addMovie = async (e) => {
        e.preventDefault();

        try {
            const ID = parseInt(movieID);
            const res = await fetch(`http://127.0.0.1:8000/api/watchlists/add/movies`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.accessToken}`,  // Include token in Authorization header
                    'Content-Type': 'application/json',                // Include Content-Type header
                },
                body: JSON.stringify({
                    watchlist_id: 1,           // Pass the watchlist_id
                    movie_list: [ID]           // Pass the movie_list as an array of integers
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail);
            }

            const data = await res.json();
            alert('Movie added successfully');
            setMovieID("");

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
            <ul className='flex gap-24'>
                {/* {watchlists.map(watchlist => (
                    <Watchlist key={watchlist.id} watchlist={watchlist} />
                ))} */}
            </ul>



            <form onSubmit={addMovie}>
                <label htmlFor="movieID">Movie ID:</label>
                <input
                    type="number"
                    id="movieID"
                    value={movieID}
                    onChange={(e) => setMovieID(e.target.value)}
                    required
                />
                <button type="submit">Add Movie</button>

            </form>
        </div>
    );
}
