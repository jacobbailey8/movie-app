'use client';

import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

export default function MovieAutocomplete() {
    const [titles, setTitles] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (inputValue.length >= 3) {
            setLoading(true);
            fetch(`http://localhost:8000/api/movies/by-title/${inputValue}`)
                .then((response) => response.json())
                .then((data) => {
                    const titlesArray = data.map((movie) => movie.title);
                    console.log(titlesArray);
                    // const titlesArray = ['Test Movie', 'Test Movie 2', 'Test Movie 3'];
                    setTitles(titlesArray);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching movies:", error);
                    setLoading(false);
                });

        }
        else {
            setTitles([]);
        }


    }, [inputValue]);

    return (
        <Autocomplete
            options={titles}
            // getOptionLabel={(option) => option.name}
            loading={loading}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Search for a movie"
                    variant="outlined"
                    fullWidth
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
