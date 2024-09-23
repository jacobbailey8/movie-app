'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import CircularProgress from '@mui/material/CircularProgress';




export default function Modal({ movie, closeModal }) {

    const [img_url, setImgUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [tags, setTags] = useState([]);
    const [sentimentColor, setSentimentColor] = useState('');
    const [userVote, setUserVote] = useState(0);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            if (movie) {
                const ACCESS_TOKEN = process.env.NEXT_PUBLIC_ACCESS_TOKEN_TMDB;

                const options = {
                    method: 'GET',
                    headers: {
                        accept: 'application/json',
                        Authorization: `Bearer ${ACCESS_TOKEN}`
                    }
                };
                try {
                    let base_url = 'https://api.themoviedb.org/3/search/movie?query='
                    if (movie.type !== 'Movie') {
                        base_url = 'https://api.themoviedb.org/3/search/tv?query='
                    }
                    const res = await fetch(`${base_url}${movie.title}`, options);
                    if (!res.ok) {
                        const message = `An error has occured: ${res.status}`;
                        throw new Error(message);
                    }
                    const data = await res.json();

                    // find image url, user rating if exists, 
                    const firstResult = data?.results[0];
                    const img_url = 'https://image.tmdb.org/t/p/w500' + firstResult?.poster_path;
                    firstResult?.poster_path ? setImgUrl(img_url) : setImgUrl('None');

                    // set user rating if exists
                    const userRating = firstResult?.vote_average;
                    userRating ? setUserVote(userRating) : setUserVote(0);

                    // get id for review fetch
                    const id = firstResult?.id;
                    // call fastAPI endpoint to get reviews
                    const res2 = await fetch(`http://localhost:8000/api/reviews/${movie.type === 'Movie' ? 'movie' : 'tv'}?movie_id=${id}`);

                    if (!res2.ok) {
                        const message = `An error has occured: ${res2.status}`;
                        throw new Error(message);
                    }
                    const data2 = await res2.json();
                    const tagData = data2.tags;
                    setTags(tagData);

                    if (data2.sentiment === 'Positive') {
                        setSentimentColor('bg-green-200');
                    }
                    else if (data2.sentiment === 'Negative') {
                        setSentimentColor('bg-red-200');
                    }
                    else {
                        setSentimentColor('bg-yellow-200');
                    }


                } catch (error) {

                    console.error(error)


                }
            }
            setLoading(false);

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
                className="bg-white p-2 rounded-lg shadow-lg w-80  max-w-96 max-h-[36rem] flex flex-col items-center"
                onClick={(e) => e.stopPropagation()} // Prevent modal click from triggering overlay click
            >
                {loading && <CircularProgress className='mt-24' color='inherit' />}
                {!loading && (<>
                    <button
                        className='text-lg font-bold self-end mr-2'
                        onClick={closeModal}
                    >
                        &times;
                    </button>
                    {img_url !== 'None' ? <img src={img_url} alt={movie.title} className="w-48 sm:w-52 rounded mb-4" /> : <div>No Image Available</div>}
                    <h2 className="text-md font-bold mb-4">{movie.title}</h2>
                    <div className='flex justify-around items-center gap-4'>
                        <div className='flex gap-1'>
                            {/* <Image
                                src="/images/tomato.png"  // Path to your image in the public folder
                                alt="Tomato" // alt text
                                width={20} // Image width
                                height={10} // Image height
                            /> */}
                            <div>84%</div>
                        </div>
                        <div className='flex gap-1'>
                            {/* <Image
                                src="/images/popcorn.png"  // Path to your image in the public folder
                                alt="Tomato" // alt text
                                width={20} // Image width
                                height={10} // Image height
                            /> */}
                            <div>{`${(userVote * 10).toFixed()}%`}</div>
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-2 items-center mt-4 mb-2 justify-center max-w-64 overflow-y-auto'>
                        {tags && tags.map((tag, index) => (
                            <div key={index} className={`p-2 rounded-md ${sentimentColor}`}>{tag}</div>
                        ))}

                    </div>
                </>)}


            </div>
        </div>
    );
}
