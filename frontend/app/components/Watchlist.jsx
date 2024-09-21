'use client';
import MovieRow from './MovieRow';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import DeleteIcon from '@mui/icons-material/Delete';

function Watchlist({ watchlist, setWatchlists }) {
    const [watchlistMovies, setWatchlistMovies] = useState(watchlist.movies);
    const { data: session, status } = useSession();

    const handleRecommend = async () => {
    };

    const handleDeleteWatchlist = async () => {
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/watchlists/delete/${watchlist.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.accessToken}`, // Include token from session
                },
            });

            if (res.ok) {
                setWatchlists((prevWatchlists) => prevWatchlists.filter((wl) => wl.id !== watchlist.id));
            }
        } catch (error) {
            console.error('Error:', error);
        }


    };


    return (
        <div className="snap-start min-w-full sm:min-w-64">
            <div className="m-4  bg-neutral-100 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800">{watchlist.name}</h2>

                {watchlistMovies.length > 0 && <hr className="my-3 border-neutral-400" />}

                <div className="flex flex-col space-y-4">
                    {watchlistMovies.map((movie) => (
                        <MovieRow
                            key={movie.show_id}
                            movie={movie}
                            watchlistID={watchlist.id}
                            watchlistMovies={watchlistMovies}
                            setWatchlistMovies={setWatchlistMovies}
                        />
                    ))}
                </div>

                <div className="flex justify-between items-center mt-8">
                    {watchlistMovies.length > 0 && (
                        <button
                            onClick={handleRecommend}
                            className="p-3 rounded-md bg-orange-400 hover:bg-orange-500 text-white px-4 font-semibold shadow-md transition-all ease-in-out duration-200"
                        >
                            Find Similar
                        </button>
                    )}

                    <div
                        onClick={handleDeleteWatchlist}
                        className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 cursor-pointer transition-all ease-in-out duration-200"
                    >
                        <DeleteIcon className="text-neutral-800 " />
                    </div>
                </div>
            </div>
        </div>

        // <div className='snap-start min-w-full sm:min-w-64'>
        //     <div className=" m-4 bg-neutral-300 p-4 rounded">
        //         <h2 className="text-lg font-semibold">{watchlist.name}</h2>
        //         {watchlistMovies.length > 0 && <hr className='my-2 border-neutral-400 ' />}
        //         <div className="flex flex-col">
        //             {watchlistMovies.map((movie) => (
        //                 <MovieRow key={movie.show_id} movie={movie} watchlistID={watchlist.id} watchlistMovies={watchlistMovies} setWatchlistMovies={setWatchlistMovies} />
        //             ))}
        //         </div>
        //         <div className='flex justify-between items-center'>
        //             {watchlistMovies.length > 0 && <button onClick={handleRecommend} className='p-2 rounded-md bg-orange-400 hover:bg-orange-500 text-slate-50 mt-16 px-4 font-semibold'>Find Similar</button>}
        //             <div onClick={handleDeleteWatchlist} className='mt-16 p-1 rounded-full hover:bg-neutral-400 cursor-pointer'><DeleteIcon className='text-neutral-800' /></div>
        //         </div>

        //     </div>
        // </div>


    )
}

export default Watchlist