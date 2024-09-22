'use client';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Watchlist from './Watchlist';
import RecommendedMovie from './RecommendedMovie';
import '../../app/globals.css';

export default function WatchlistPage({ reRender }) {
    const { data: session, status } = useSession();
    const [watchlists, setWatchlists] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [recommendationListTitle, setRecommendationListTitle] = useState('');
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
                        <Watchlist watchlist={watchlist} setWatchlists={setWatchlists} setRecommendations={setRecommendations} setRecommendationListTitle={setRecommendationListTitle} />
                    </div>
                ))}
            </div>

            {recommendationListTitle.length > 0 && (
                <div className='recommend-container'>
                    <h1 className='font-bold text-xl my-6'>Recommendations based on {recommendationListTitle}:</h1>
                    <div className='rec-scroll flex items-center gap-8 px-4 pb-6 max-w-screen overflow-x-auto'>
                        {recommendations?.length > 0 ?
                            recommendations.map((movie) => (
                                <RecommendedMovie key={movie.movie_id} movie={movie} />

                            )) : <div className='text-lg font-bold'>No recommendations available</div>}
                    </div>
                </div>)}


        </div>


    );
}
