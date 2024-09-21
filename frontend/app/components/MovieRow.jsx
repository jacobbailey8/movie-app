import { useSession } from 'next-auth/react';



function MovieRow({ movie, watchlistID, watchlistMovies, setWatchlistMovies }) {
    const { data: session, status } = useSession();

    const removeMovie = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/watchlists/${watchlistID}/movies/${movie.show_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.accessToken}`, // Replace with your auth token if needed
                },
            })
            if (response.ok) {
                setWatchlistMovies(watchlistMovies.filter((m) => m.show_id !== movie.show_id))



            }
        } catch (error) {
            console.error(error.detail)
        }
    }
    return (
        <div className="flex items-center justify-between">
            <div className=" overflow-x-hidden whitespace-nowrap">{movie.title}</div>

            <div className='hover:opacity-50 cursor-pointer' onClick={removeMovie} >&times;</div>



        </div>
    )
}

export default MovieRow