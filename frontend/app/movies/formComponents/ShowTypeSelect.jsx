'use client';

function ShowTypeSelect({ selectedShowType, setSelectedShowType }) {
    const handleChange = (event) => {
        setSelectedShowType(event.target.name);
    };
    return (
        <div >
            <h2 >Select Show Type</h2>
            <div >
                <label >
                    <input
                        type="checkbox"
                        name="Movie"
                        checked={selectedShowType === 'Movie'}
                        onChange={handleChange}
                    />
                    Movie
                </label>
            </div>
            <div >
                <label >
                    <input
                        type="checkbox"
                        name="Tv show"
                        checked={selectedShowType === 'Tv show'}
                        onChange={handleChange}
                    />
                    TV Show
                </label>
            </div>

        </div>
    )
}

export default ShowTypeSelect