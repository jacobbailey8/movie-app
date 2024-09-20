import MovieRow from './MovieRow';

function Watchlist({ watchlist }) {
    return (
        <div className='snap-start min-w-full sm:min-w-0'>
            <div className=" m-4 sm:m-0 bg-neutral-300 p-4">
                <h2 className="">{watchlist.name}</h2>
                <div className="flex flex-col">
                    {watchlist.movies.map((movie) => (
                        <MovieRow key={movie.id} movie={movie} />
                    ))}
                </div>
            </div>
        </div>


    )
}

export default Watchlist