'use client';

function StreamingServiceSelect({ streamingService, setStreamingService }) {
    const handleChange = (event) => {
        setStreamingService(event.target.name);
    };
    return (
        <div >
            <h2 >Select Streaming Service</h2>
            <div >
                <label >
                    <input
                        type="checkbox"
                        name="Netflix"
                        checked={streamingService === 'Netflix'}
                        onChange={handleChange}
                    />
                    Netflix
                </label>
            </div>
            <div >
                <label >
                    <input
                        type="checkbox"
                        name="Hulu"
                        checked={streamingService === 'Hulu'}
                        onChange={handleChange}
                    />
                    Hulu
                </label>
            </div>

        </div>
    )
}

export default StreamingServiceSelect