'use client';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import WatchlistPage from './components/WatchlistPage';

export default function HomePage() {
  const { data: session, status } = useSession();
  const [watchlistName, setWatchlistName] = useState("");
  const [error, setError] = useState(null); // State for managing errors


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://127.0.0.1:8000/api/watchlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`, // Include token from session
        },
        body: JSON.stringify({
          name: watchlistName, // Assuming you're sending the name of a watchlist
        }),
      });

      if (!res.ok) {
        // If the status is not OK (200-299), parse the error
        const errorData = await res.json();
        throw new Error(errorData.detail); // `detail` is from FastAPI's HTTPException
      }

      const data = await res.json();
      alert('Watchlist created successfully');
      setWatchlistName(""); // Clear input on success
      setError(null); // Clear any previous errors
    } catch (error) {
      setError(error.message); // Set the error message to display it on the frontend
    }
  };

  if (status === 'loading') {
    return <p>Loading...</p>;
  } else {
    return (
      <div className='sm:pl-56'>
        <p className="p-4">{session?.username}'s dashboard</p>
        <form onSubmit={handleSubmit} className="p-4">
          <label htmlFor="watchlistName">Watchlist Name:</label>
          <input
            type="text"
            id="watchlistName"
            value={watchlistName}
            onChange={(e) => setWatchlistName(e.target.value)}
            required
          />
          <button type="submit">Create Watchlist</button>
        </form>
        {/* Display error message if one exists */}
        {error && <p className='p-4 text-red-500'>{error}</p>}
        <WatchlistPage />
      </div>
    );
  }
}
