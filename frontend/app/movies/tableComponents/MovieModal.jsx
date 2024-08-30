'use client';
import React, { useEffect, useState } from 'react';


export default function Modal({ movie, closeModal }) {

    const [img_url, setImgUrl] = React.useState('');

    useEffect(() => {
        async function fetchData() {
            if (movie) {
                const API_KEY_TMDB = process.env.NEXT_PUBLIC_TMDB_API_KEY;
                const ACCESS_TOKEN = process.env.NEXT_PUBLIC_ACCESS_TOKEN_TMDB;

                const options = {
                    method: 'GET',
                    headers: {
                        accept: 'application/json',
                        Authorization: `Bearer ${ACCESS_TOKEN}`
                    }
                };



                try {
                    const res = await fetch(`https://api.themoviedb.org/3/search/movie?query=${movie.title}`, options);
                    const data = await res.json();

                    // find image url, user rating if exists, 
                    const firstResult = data.results[0];
                    const img_url = 'https://image.tmdb.org/t/p/w500' + firstResult.poster_path;
                    setImgUrl(img_url);



                } catch (error) {
                    console.error(error)


                }
            }
        }
        fetchData();
    }, [movie]);

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };


    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleOverlayClick}
        >
            <div
                className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full"
                onClick={(e) => e.stopPropagation()} // Prevent modal click from triggering overlay click
            >
                <img src={img_url} alt={movie.title} className="w-full h-auto mb-4 rounded" />
                <h2 className="text-lg font-bold mb-4">Modal Title</h2>

                <button
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                    onClick={closeModal}
                >
                    Close Modal
                </button>
            </div>
        </div>
    );
}
