'use client';

import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

export default function GenreAutocomplete({ genre, setGenre }) {
    const [genres, setGenres] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (inputValue.length >= 3) {
            setLoading(true);
            fetch(`http://localhost:8000/api/movies/by-genre/${inputValue}`)
                .then((response) => response.json())
                .then((data) => {
                    const titlesArray = data.map((movie) => movie.genre);
                    setGenres(titlesArray);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching movies:", error);
                    setLoading(false);
                });

        }
        else {
            setGenres([]);
        }


    }, [inputValue]);

    return (
        <Autocomplete

            options={genres}
            // getOptionLabel={(option) => option.title}
            loading={loading}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            onChange={(event, newValue) => {
                setGenre(newValue);  // Update the country prop when a country is selected
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Enter a genre"
                    variant="outlined"
                    className="w-full sm:w-64 md:w-80 lg:w-96"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                                borderColor: '#FB923C', // Tailwind's orange-300 color
                            },
                        },
                        '& .MuiInputLabel-root': {
                            '&.Mui-focused': {
                                color: '#FB923C', // Tailwind's orange-300 color for label when focused
                            },
                        },
                    }}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading ? <CircularProgress color="inherit" size={20} key="loading" /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    );
}
