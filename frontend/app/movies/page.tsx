


export default async function movies() {
    const movies = await getMovies();

    return (
        <>
            <h1>Movies</h1>
            <ul>
                {movies.map((movie: any) => (
                    <li key={movie.show_id}>{movie.title}</li>
                ))}
            </ul>
        </>
    );
}


export async function getMovies() {
    try {
        const res = await fetch('http://127.0.0.1:8000/api/movies/');
        const movies = await res.json();
        return movies;
    } catch (error) {
        console.log('Fetch failed:', error);
        return [];  // Return an empty array or handle the error as needed
    }
}
