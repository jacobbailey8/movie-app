'use client';
import React, { useState } from 'react';
import ShowTypeSelect from './formComponents/ShowTypeSelect';


export default function SearchForm({ setMovies }) {
    const [selectedShowType, setSelectedShowType] = useState(null);
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
        const response = await fetch(url);
        const data = await response.json();
        setTotalPages(Math.ceil(data.total / limit));
        setMovies(data.movies);
    };

    return (
        <>
            <form onSubmit={(e) => handleSearch(e, 1)}>
                <ShowTypeSelect selectedShowType={selectedShowType} setSelectedShowType={setSelectedShowType} />
                <button type='submit'>Search</button>
            </form>
            <div className='flex items-center'>
                {pageNum > 1 ? <button onClick={(e) => { handleSearch(e, pageNum - 1); setPageNum(pageNum - 1) }} className='text-slate-300 bg-slate-600 p-2 rounded-sm'>Prev</button> : <button className='text-slate-300 bg-slate-600 p-2 rounded-sm opacity-40'>Prev</button>}
                {pageNum < totalPages ? <button onClick={(e) => { handleSearch(e, pageNum + 1); setPageNum(pageNum + 1) }} className='text-slate-300 bg-slate-600 p-2 rounded-sm'>Next</button>
                    : <button className='text-slate-300 bg-slate-600 p-2 rounded-sm opacity-40'>Next</button>}
                <div className='ml-48'>{pageNum}/{totalPages}</div>
            </div>
        </>
    );
}




