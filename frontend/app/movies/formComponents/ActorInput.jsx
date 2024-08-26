'use client';
function ActorInput({ actor, setActor }) {
    const handleChange = (event) => {
        setActor(event.target.value);
    };
    return (
        <>
            <h2>Enter Actor Name: </h2>
            <label >
                <input className="text-black"
                    type="text"
                    value={actor}
                    onChange={handleChange}
                    placeholder=""
                />

            </label>
        </>
    )
}

export default ActorInput