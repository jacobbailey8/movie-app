'use client';
import Slider from '@mui/material/Slider';
import { useState } from 'react';
function YearRange({ minYear, setMinYear, maxYear, setMaxYear }) {
    const [value, setValue] = useState([minYear, maxYear]);
    const handleChange = (event, newValue) => {
        setValue(newValue);
        setMinYear(newValue[0]);
        setMaxYear(newValue[1]);
    };


    return (
        <>
            <h2 className='opacity-50 text-sm font-bold mb-4 mt-4'>Release Year Range:</h2>
            <Slider
                getAriaLabel={() => 'Release year range'}
                value={value}
                onChange={handleChange}
                valueLabelDisplay="auto"
                min={1920}
                max={2021}
                style={{ width: '18rem' }} // Adjust this as needed
                className='text-orange-300'

            />
            {/* <h2>Min Year: </h2>
            <label >
                <input className="text-black"
                    type="number"
                    value={minYear}
                    onChange={handleChangeMin}
                    placeholder="1980"
                />

            </label>
            <h2>Max Year: </h2>
            <label >
                <input className="text-black"
                    type="number"
                    value={maxYear}
                    onChange={handleChangeMax}
                    placeholder="2024"
                />

            </label> */}
        </>
    )
}

export default YearRange