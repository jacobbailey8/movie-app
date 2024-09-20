

function Watchlist({ watchlist }) {
    return (
        <div>
            <h3>{watchlist.name}</h3>
            <ul>
                {watchlist.movies.map(movie => (
                    <li key={movie.show_id}>{movie.title}</li>
                ))}
            </ul>
        </div>
    )
}

export default Watchlist