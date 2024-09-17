'use client';
import React, { useEffect } from 'react';

function ShowTypeSelect({ selectedShowType, setSelectedShowType }) {

    const handleClick = (event) => {
        event.preventDefault();
        selectedShowType === event.target.value ? setSelectedShowType(null) : setSelectedShowType(event.target.value);
    };

    useEffect(() => {
        const buttons = document.querySelectorAll('.show-btn');
        buttons.forEach(button => {
            if (button.value === selectedShowType) {
                button.classList.add('bg-orange-300');
            }
            else {
                button.classList.remove('bg-orange-300');
            }
        });
    }, [selectedShowType]);
    return (
        <>
            <h2 className='opacity-50 text-sm font-bold mb-2'>Select Show Type</h2>
            <div className='flex gap-2 items-center'>

                <button value='Movie' onClick={handleClick} className='show-btn border-2 border-orange-300 rounded p-2 transition-colors duration-300 ease-in-out'>Movie</button>
                <button value='Tv show' onClick={handleClick} className='show-btn border-2 border-orange-300 rounded p-2 transition-colors duration-300 ease-in-out'>TV Show</button>

            </div>
        </>


        // <div >
        //     <h2 >Select Show Type</h2>
        //     <div >
        //         <label >
        //             <input
        //                 type="checkbox"
        //                 name="Movie"
        //                 checked={selectedShowType === 'Movie'}
        //                 onChange={handleChange}
        //             />
        //             Movie
        //         </label>
        //     </div>
        //     <div >
        //         <label >
        //             <input
        //                 type="checkbox"
        //                 name="Tv show"
        //                 checked={selectedShowType === 'Tv show'}
        //                 onChange={handleChange}
        //             />
        //             TV Show
        //         </label>
        //     </div>

        // </div>
    )
}

export default ShowTypeSelect