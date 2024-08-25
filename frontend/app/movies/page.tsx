'use client';
import React, { useState } from 'react';
import SearchForm from './SearchForm.jsx';

export default function movies() {
    const [movies, setMovies] = useState([]);


    return (
        <>
            <SearchForm setMovies={setMovies} />
            <ul>
                {movies.map((movie: any) => (
                    <li key={movie.show_id}>{movie.title}</li>
                ))}
            </ul>

        </>
    );
}



