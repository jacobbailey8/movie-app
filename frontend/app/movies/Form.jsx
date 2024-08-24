'use client';
import { useState } from 'react';

export default function MovieSearchForm(setMovies) {

  const [isTvShow, setIsTvShow] = useState(false);
  const [minReleaseYear, setMinReleaseYear] = useState('');
  const [directorName, setDirectorName] = useState('');

  // const handleSearch = async () => {
  //   let query = `/movies?`;
  //   if (isTvShow !== null) query += `is_tv_show=${isTvShow}&`;
  //   if (minReleaseYear) query += `min_release_year=${minReleaseYear}&`;
  //   if (directorName) query += `director_name=${directorName}&`;

  //   const response = await fetch(query);
  //   const data = await response.json();
  //   setMovies(data);
  // };

  return (
    <div>
      <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
        <input
          type="checkbox"
          checked={isTvShow}
          onChange={(e) => setIsTvShow(e.target.checked)}
        />
        <input
          type="number"
          value={minReleaseYear}
          onChange={(e) => setMinReleaseYear(e.target.value)}
        />
        <input
          type="text"
          value={directorName}
          onChange={(e) => setDirectorName(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>


    </div>
  );
}
