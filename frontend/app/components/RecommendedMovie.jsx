import React, { useEffect, useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress';


function RecommendedMovie({ movie }) {

    const [movieData, setMovieData] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        gatherMovieInfo();
    }, []);

    const gatherMovieInfo = async () => {
        setLoading(true);
        try {
            let url = '';
            if (movie.type === 'Movie') {
                url = `https://api.themoviedb.org/3/search/movie?query=${movie.title}&include_adult=false&language=en-US&page=1`;
            }
            else {
                url = `https://api.themoviedb.org/3/search/tv?query=${movie.title}&include_adult=false&language=en-US&page=1`;
            }
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjliNjQxN2Y0ZjkzZDQwMTNlNjRjMDNhZDg4YjYxMSIsIm5iZiI6MTcyNjk3OTM2MS40NzczMDksInN1YiI6IjY2ZDFmZmQwYjYzZTMyNTkyNDliOGYyOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZE7_mvYX74boydtRkMqw_jRXhLIxJxt4LKCNyw4w-tI'
                }
            };

            const res = await fetch(url, options);
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail);
            }
            else {
                const data = await res.json();
                const movieData = data.results[0];
                setMovieData(movieData);
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setLoading(false);
    }
    return (
        <>
            {loading && <CircularProgress color='inherit' />}
            {!loading && movieData && (
                <div className="flex flex-col items-center">
                    <img className='min-w-40 max-w-40 rounded-md' src={`https://image.tmdb.org/t/p/w500${movieData.poster_path}`} alt={movieData.title} />
                    <h2 className="text-lg font-bold mt-2">{movieData.title}</h2>
                    {/* <p className='overflow-y-auto max-h-36'>{movieData.overview}</p> */}
                </div>
            )}
        </>

    )
}

export default RecommendedMovie