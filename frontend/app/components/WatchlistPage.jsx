'use client';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Watchlist from './Watchlist';
import '../../app/globals.css';

export default function WatchlistPage({ reRender }) {
    const { data: session, status } = useSession();
    const [watchlists, setWatchlists] = useState([]);
    const [error, setError] = useState(null);


    useEffect(() => {
        if (session) {
            fetchWatchlists();
        }
    }, [session, reRender]);

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
        <div className="container mx-auto">
            <div className="scroll-container flex sm:grid sm:grid-cols-[repeat(auto-fit,minmax(370px,1fr))] gap-4 snap-x snap-mandatory overflow-x-auto">
                {watchlists.map((watchlist) => (
                    <div key={watchlist.id} className="snap-start min-w-[370px]">
                        <Watchlist watchlist={watchlist} setWatchlists={setWatchlists} />
                    </div>
                ))}
            </div>
        </div>


    );
}
