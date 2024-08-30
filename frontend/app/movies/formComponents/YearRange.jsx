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
                sx={{

                    color: 'orange', // Makes the slider orange
                    '& .MuiSlider-thumb': {
                        backgroundColor: 'orange', // Thumb color
                    },
                    '& .MuiSlider-track': {
                        backgroundColor: 'orange', // Track color
                    },
                    '& .MuiSlider-rail': {
                        backgroundColor: '#ffcc80', // Rail color (lighter shade of orange)
                    },
                }}

            />

        </>
    )
}

export default YearRange