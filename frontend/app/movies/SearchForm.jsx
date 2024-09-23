'use client';
import React, { useState } from 'react';
import ShowTypeSelect from './formComponents/ShowTypeSelect';
import DirectorInput from './formComponents/DirectorInput';
import ActorInput from './formComponents/ActorInput';
import StreamingServiceSelect from './formComponents/StreamingServiceSelect';
import YearRange from './formComponents/YearRange';
import GenreAutocomplete from './formComponents/GenreSelect';
import CountryAutocomplete from './formComponents/CountrySelect';
import MovieTitleAutocomplete from './formComponents/MovieTitleAutocomplete';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

export default function SearchForm({ setMovies, setShowForm, setLoading }) {
    const [title, setTitle] = useState('');
    const [selectedShowType, setSelectedShowType] = useState(null);
    const [director, setDirector] = useState('');
    const [actor, setActor] = useState('');
    const [streamingService, setStreamingService] = useState(null);
    const [minYear, setMinYear] = useState(1980);
    const [maxYear, setMaxYear] = useState(2024);
    const [genre, setGenre] = useState(null);
    const [country, setCountry] = useState(null);


    // const [pageNum, setPageNum] = useState(1);
    // const [totalPages, setTotalPages] = useState(1);

    const [pageNum, setPageNum] = useState(() => {
        // Retrieve the session data or set an empty array if not available
        const pageNumberSaved = sessionStorage.getItem('pageNum');
        return pageNumberSaved ? JSON.parse(pageNumberSaved) : 1;
    });

    const [totalPages, setTotalPages] = useState(() => {
        // Retrieve the session data or set an empty array if not available
        const totalPagesSaved = sessionStorage.getItem('totalPages');
        return totalPagesSaved ? JSON.parse(totalPagesSaved) : 1;
    });



    const handleSearch = async (event, page = 1) => {
        event.preventDefault();
        setLoading(true);

        // handle api call
        const limit = 20;
        const skip = (page - 1) * limit;

        let url = `http://localhost:8000/api/movies/filter/?skip=${skip}&`;
        if (title) {
            url += `title=${title}`;
        }
        if (selectedShowType) {
            url += `&show_type=${selectedShowType}`;
        }
        if (director) {
            url += `&director=${director}`;
        }
        if (actor) {
            url += `&actor=${actor}`;
        }
        if (streamingService) {
            url += `&streaming_service=${streamingService}`;
        }
        if (minYear) {
            url += `&min_release_year=${minYear}`;
        }
        if (maxYear) {
            url += `&max_release_year=${maxYear}`;
        }
        if (genre) {
            url += `&genre=${genre}`;
        }
        if (country) {
            url += `&country=${country}`;
        }


        const response = await fetch(url);
        const data = await response.json();
        setTotalPages(Math.ceil(data.total / limit));
        sessionStorage.setItem('pageNum', JSON.stringify(page));
        sessionStorage.setItem('totalPages', JSON.stringify(Math.ceil(data.total / limit)));
        setLoading(false);
        // setShowForm(false);
        sessionStorage.setItem('movies', JSON.stringify(data.movies));
        setMovies(data.movies);

    };

    const handleNewSearch = async (event, page = 1) => {
        handleSearch(event, page);
        sessionStorage.setItem('pageNum', JSON.stringify(1));
        setPageNum(1);

    }

    return (

        <div className='p-4'>
            {/* search form */}
            <form onSubmit={(e) => handleNewSearch(e, 1)} className=''>
                <MovieTitleAutocomplete setTitle={setTitle} />
                <ShowTypeSelect selectedShowType={selectedShowType} setSelectedShowType={setSelectedShowType} />
                <DirectorInput director={director} setDirector={setDirector} />
                <ActorInput actor={actor} setActor={setActor} />
                <StreamingServiceSelect streamingService={streamingService} setStreamingService={setStreamingService} />
                <YearRange minYear={minYear} setMinYear={setMinYear} maxYear={maxYear} setMaxYear={setMaxYear} />
                <GenreAutocomplete genre={genre} setGenre={setGenre} />
                <CountryAutocomplete country={country} setCountry={setCountry} />
                <div className='flex flex-row sm:flex-col gap-16 mt-4 mb-4 items-center sm:items-start sm:gap-0'>
                    <button className='bg-orange-400 font-bold border border-orange-400 rounded p-2 text-slate-50 w-40 hover:opacity-80' type='submit'>Search</button>
                    <div onClick={() => setShowForm(false)} className='hidden sm:block sm:mt-6 cursor-pointer hover:opacity-60'><ArrowBackIosIcon /></div>
                </div>
            </form>

            {/* pagination */}
            <div className='flex items-center gap-2'>
                {pageNum > 1 ? <button onClick={(e) => { handleSearch(e, pageNum - 1); setPageNum(pageNum - 1) }} className='text-slate-50 bg-neutral-800 py-2 px-4 rounded-sm'>Prev</button> : <button className='text-slate-50 bg-neutral-800 py-2 px-4 rounded-sm opacity-40'>Prev</button>}
                {pageNum < totalPages ? <button onClick={(e) => { handleSearch(e, pageNum + 1); setPageNum(pageNum + 1) }} className='text-slate-50 bg-neutral-800 py-2 px-4 rounded-sm'>Next</button>
                    : <button className='text-slate-50 bg-neutral-800 py-2 px-4 rounded-sm opacity-40'>Next</button>}
                <div className='ml-4'>{pageNum}/{totalPages}</div>
            </div>
        </div>


    );
}

