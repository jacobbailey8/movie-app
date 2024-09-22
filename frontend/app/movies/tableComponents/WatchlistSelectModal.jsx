import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import CloseIcon from '@mui/icons-material/Close';

export default function WatchlistSelectModal({ isOpen, onClose, watchlists, movies }) {

    const [selectedWatchlist, setSelectedWatchlist] = useState([]);
    const { data: session, status } = useSession();

    const handleCheckboxChange = (watchlistID) => {
        if (selectedWatchlist.includes(watchlistID)) {
            setSelectedWatchlist(selectedWatchlist.filter(id => id !== watchlistID));
        } else {
            setSelectedWatchlist([...selectedWatchlist, watchlistID]);
        }
    };

    const addMovies = async () => {
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/watchlists/add/movies`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.accessToken}`,  // Include token in Authorization header
                    'Content-Type': 'application/json',                // Include Content-Type header
                },
                body: JSON.stringify({
                    watchlist_ids: selectedWatchlist,           // Pass the watchlist_id
                    movie_list: movies           // Pass the movie_list as an array of integers
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail);
            }
            else {
                const data = await res.json();
                const addedMovies = data.added_movies;
                const numWatchlists = Object.keys(addedMovies).length;
                const numMovies = Object.values(addedMovies).reduce((acc, val) => acc + val.length, 0);
                console.log(`Added ${numMovies} movies to ${numWatchlists} watchlists`);
            }

        } catch (error) {
            console.error(error);
        }
    };


    const handleSubmit = async () => {
        // Handle submit here
        await addMovies();
        onClose();
    };

    if (!isOpen) return null; // Do not render if the modal is not open
    // Prevent click events inside the modal from closing it
    const handleModalClick = (event) => {
        event.stopPropagation();
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
            <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={handleModalClick}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Select a Watchlist</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
                </div>

                <form>
                    <div className="space-y-4">
                        {watchlists.map((watchlist) => (
                            <div
                                key={watchlist.id}
                                onClick={() => handleCheckboxChange(watchlist.id)}  // Handle row click to select checkbox
                                className={`flex items-center space-x-3 p-4 bg-white shadow-md rounded-md hover:bg-gray-100 transition duration-200 ease-in-out cursor-pointer ${selectedWatchlist.includes(watchlist.id) ? 'bg-orange-50' : ''
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    value={watchlist.id}
                                    checked={selectedWatchlist.includes(watchlist.id)}
                                    onChange={(e) => {
                                        e.stopPropagation();  // Prevent event bubbling to avoid double triggering
                                        handleCheckboxChange(watchlist.id);
                                    }}
                                    className="appearance-none h-5 w-5 border border-gray-300 rounded-md checked:bg-orange-300 checked:border-transparent focus:outline-none !important"
                                />
                                <label className="text-gray-700 font-medium">{watchlist.name}</label>
                            </div>
                        ))}
                    </div>

                    <button type="button" onClick={handleSubmit} className=' mt-4 p-2 rounded bg-neutral-800 text-slate-50 font-semibold'>Add Movies</button>
                </form>


            </div>
        </div>
    );
}
