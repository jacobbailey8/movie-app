import React, { useState, useEffect } from 'react';

const Modal = ({ show, onClose, movie }) => {
    const [posterUrl, setPosterUrl] = useState('');

    useEffect(() => {
        if (show && movie) {
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNDg3Yjk2Y2I0YWFmYzlkNzg4MzlhYzU5YWEwOTZmNyIsIm5iZiI6MTcyNDczNDk0NC44MTExNzgsInN1YiI6IjY2Y2QyYzIyYWY3YjQ3Y2VkZjlmNWI0OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jSPJ-SHDsan0x6tzceRFgJZM63-655QZJw3rTKaa8mE' // Replace with your actual API key
                }
            };
            fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(movie.title)}&include_adult=false&language=en-US&page=1`, options)
            .then(response => response.json())
            .then(data => {
                if (data.results && data.results.length > 0) {
                    // Get the first result
                    const firstResult = data.results[0];
                    // Get the poster_path from the first result
                    const posterPath = firstResult.poster_path;

                    // If you need the full URL for the poster image
                    const posterBaseUrl = 'https://image.tmdb.org/t/p/w500'; // Base URL for poster images
                    const fullPosterUrl = `${posterBaseUrl}${posterPath}`;
                    setPosterUrl(fullPosterUrl);
                } else {
                    console.log('No results found.');
                }
            })
            .catch(err => console.error(err));
        }
    }, [show, movie]);

    if (!show) return null;
   
      
    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-md w-full">
                <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl"
                    onClick={onClose}
                >
                    &times;
                </button>
                <h2 className="text-xl font-semibold mb-2 text-gray-900">{movie.title}</h2>
                {posterUrl && (
                    <img 
                        src={posterUrl} 
                        alt={movie.title} 
                        className="w-full h-auto mb-4 rounded" 
                        style={{ maxWidth: '200px' }} // Adjust width as needed
                    />
                )}
                <p className="text-gray-700">{movie.description}</p>
            </div>
        </div>
    );
};

export default Modal;
