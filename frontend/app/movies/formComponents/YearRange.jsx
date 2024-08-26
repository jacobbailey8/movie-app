'use client';
function YearRange({ minYear, setMinYear, maxYear, setMaxYear }) {
    const handleChangeMin = (event) => {
        setMinYear(event.target.value);
    };
    const handleChangeMax = (event) => {
        setMaxYear(event.target.value);
    };
    return (
        <>
            <h2>Min Year: </h2>
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

            </label>
        </>
    )
}

export default YearRange