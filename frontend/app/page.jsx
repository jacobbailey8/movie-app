'use client';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import WatchlistPage from './components/WatchlistPage';

export default function HomePage() {
  const { data: session, status } = useSession();
  const [watchlistName, setWatchlistName] = useState("");
  const [error, setError] = useState(null); // State for managing errors
  const [reRender, setReRender] = useState(false);

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
      setWatchlistName(""); // Clear input on success
      setError(null); // Clear any previous errors
      setReRender(!reRender);
    } catch (error) {
      setError(error.message); // Set the error message to display it on the frontend
    }
  };

  if (status === 'loading') {
    return <p>Loading...</p>;
  } else {
    return (
      <div className='sm:pl-56'>
        <p className="p-4 font-bold text-lg pt-2">{session?.username}'s Dashboard</p>
        <form onSubmit={handleSubmit} className="p-4">
          <input
            className="p-2 border border-neutral-200 rounded min-w-64 mt-2 sm:mt-0"
            type="text"
            id="watchlistName"
            value={watchlistName}
            placeholder='Watchlist Name'
            onChange={(e) => setWatchlistName(e.target.value)}
            required
          />
          <button type="submit" className='py-2 px-4 mt-4 sm:mt-0 sm:ml-4 bg-neutral-800 text-slate-50 font-semibold rounded'>Create Watchlist</button>
        </form>
        {/* Display error message if one exists */}
        {error && <p className='p-4 text-red-500'>{error}</p>}
        <WatchlistPage reRender={reRender} />
      </div>
    );
  }
}
