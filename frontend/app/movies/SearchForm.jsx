'use client';
import React, { useState } from 'react';
import ShowTypeSelect from './formComponents/ShowTypeSelect';
import DirectorInput from './formComponents/DirectorInput';
import ActorInput from './formComponents/ActorInput';
import StreamingServiceSelect from './formComponents/StreamingServiceSelect';
import YearRange from './formComponents/YearRange';

export default function SearchForm({ setMovies }) {
    const [selectedShowType, setSelectedShowType] = useState(null);
    const [director, setDirector] = useState('');
    const [actor, setActor] = useState('');
    const [streamingService, setStreamingService] = useState(null);
    const [minYear, setMinYear] = useState(1980);
    const [maxYear, setMaxYear] = useState(2024);

    const [pageNum, setPageNum] = useState(1);
    const [totalPages, setTotalPages] = useState(1);



    const handleSearch = async (event, page = 1) => {
        event.preventDefault();


        // handle api call
        const limit = 10;
        const skip = (page - 1) * limit;
        let url = `http://localhost:8000/api/movies/filter/?skip=${skip}&limit=${limit}&`;
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


        const response = await fetch(url);
        const data = await response.json();
        setTotalPages(Math.ceil(data.total / limit));
        setMovies(data.movies);
    };

    return (
        <>
            {/* search form */}
            <form onSubmit={(e) => handleSearch(e, 1)}>
                <ShowTypeSelect selectedShowType={selectedShowType} setSelectedShowType={setSelectedShowType} />
                <DirectorInput director={director} setDirector={setDirector} />
                <ActorInput actor={actor} setActor={setActor} />
                <StreamingServiceSelect streamingService={streamingService} setStreamingService={setStreamingService} />
                <YearRange minYear={minYear} setMinYear={setMinYear} maxYear={maxYear} setMaxYear={setMaxYear} />

                <button type='submit'>Search</button>
            </form>

            {/* pagination */}
            <div className='flex items-center'>
                {pageNum > 1 ? <button onClick={(e) => { handleSearch(e, pageNum - 1); setPageNum(pageNum - 1) }} className='text-slate-300 bg-slate-600 p-2 rounded-sm'>Prev</button> : <button className='text-slate-300 bg-slate-600 p-2 rounded-sm opacity-40'>Prev</button>}
                {pageNum < totalPages ? <button onClick={(e) => { handleSearch(e, pageNum + 1); setPageNum(pageNum + 1) }} className='text-slate-300 bg-slate-600 p-2 rounded-sm'>Next</button>
                    : <button className='text-slate-300 bg-slate-600 p-2 rounded-sm opacity-40'>Next</button>}
                <div className='ml-48'>{pageNum}/{totalPages}</div>
            </div>
        </>
    );
}

