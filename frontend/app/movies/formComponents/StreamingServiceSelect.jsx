'use client';
import React, { useEffect } from 'react';

function StreamingServiceSelect({ streamingService, setStreamingService }) {
    const handleClick = (event) => {
        event.preventDefault();
        setStreamingService(event.target.value);
    };

    useEffect(() => {
        const buttons = document.querySelectorAll('.streaming-btn');
        buttons.forEach(button => {
            if (button.value === streamingService) {
                button.classList.add('bg-orange-300');
            }
            else {
                button.classList.remove('bg-orange-300');
            }
        });
    }, [streamingService]);
    return (
        <>
            <h2 className='opacity-50 text-sm font-bold mb-2 mt-4'>Streaming Service</h2>
            <div className='flex gap-2 items-center w-56 flex-wrap'>

                <button value='Netflix' onClick={handleClick} className='streaming-btn border-2 border-orange-300 rounded p-2 transition-colors duration-300 ease-in-out'>Netflix</button>
                <button value='Hulu' onClick={handleClick} className='streaming-btn border-2 border-orange-300 rounded p-2 transition-colors duration-300 ease-in-out'>Hulu</button>
                <button value='Amazon prime' onClick={handleClick} className='streaming-btn border-2 border-orange-300 rounded p-2 transition-colors duration-300 ease-in-out'>Amazon Prime</button>
                <button value='Disney plus' onClick={handleClick} className='streaming-btn border-2 border-orange-300 rounded p-2 transition-colors duration-300 ease-in-out'>Disney +</button>

            </div>
        </>
    )
}

export default StreamingServiceSelect