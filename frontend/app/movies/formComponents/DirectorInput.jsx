'use client';
function DirectorInput({ director, setDirector }) {
    const handleChange = (event) => {
        setDirector(event.target.value);
    };
    return (
        <>
            <h2>Enter Director Name: </h2>
            <label >
                <input className="text-black"
                    type="text"
                    value={director}
                    onChange={handleChange}
                    placeholder="eg. Christopher Nolan"
                />

            </label>
        </>
    )
}

export default DirectorInput