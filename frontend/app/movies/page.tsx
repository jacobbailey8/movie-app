'use client';
import React, { useState } from 'react';
import SearchForm from './SearchForm.jsx';
import MovieTable from './tableComponents/MovieTable.jsx'

export default function movies() {
  const [movies, setMovies] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState(["title", "release_year"]);

  const data = [
    {
      "type": "Movie",
      "title": "Dick Johnson Is Dead",
      "director": "Kirsten Johnson",
      "cast": null,
      "country": "United States",
      "date_added": "2021-09-25",
      "release_year": 2020,
      "rating": "PG-13",
      "duration": 90,
      "listed_in": "Documentaries",
      "description": "As her father nears the end of his life, filmmaker Kirsten Johnson stages his death in inventive and comical ways to help them both face the inevitable.",
      "streaming_service": "Netflix",
      "num_seasons": null,
      "show_id": 1
    },
    {
      "type": "Tv show",
      "title": "Blood & Water",
      "director": null,
      "cast": "Ama Qamata, Khosi Ngema, Gail Mabalane, Thabang Molaba, Dillon Windvogel, Natasha Thahane, Arno Greeff, Xolile Tshabalala, Getmore Sithole, Cindy Mahlangu, Ryle De Morny, Greteli Fincham, Sello Maake Ka-Ncube, Odwa Gwanya, Mekaila Mathys, Sandi Schultz, Duane Williams, Shamilla Miller, Patrick Mofokeng",
      "country": "South Africa",
      "date_added": "2021-09-24",
      "release_year": 2021,
      "rating": "TV-MA",
      "duration": null,
      "listed_in": "International TV Shows, TV Dramas, TV Mysteries",
      "description": "After crossing paths at a party, a Cape Town teen sets out to prove whether a private-school swimming star is her sister who was abducted at birth.",
      "streaming_service": "Netflix",
      "num_seasons": 2,
      "show_id": 2
    },
    {
      "type": "Tv show",
      "title": "Ganglands",
      "director": "Julien Leclercq",
      "cast": "Sami Bouajila, Tracy Gotoas, Samuel Jouy, Nabiha Akkari, Sofia Lesaffre, Salim Kechiouche, Noureddine Farihi, Geert Van Rampelberg, Bakary Diombera",
      "country": null,
      "date_added": "2021-09-24",
      "release_year": 2021,
      "rating": "TV-MA",
      "duration": null,
      "listed_in": "Crime TV Shows, International TV Shows, TV Action & Adventure",
      "description": "To protect his family from a powerful drug lord, skilled thief Mehdi and his expert team of robbers are pulled into a violent and deadly turf war.",
      "streaming_service": "Netflix",
      "num_seasons": 1,
      "show_id": 3
    }
  ]
  return (
    <div className='flex flex-col sm:flex-row sm:justify-between sm:pl-56 '>
      <SearchForm setMovies={setMovies} />
      <ul>
        {movies.map((movie: any) => (
          <li key={movie.show_id}>{movie.title}</li>
        ))}
      </ul>
      {/* FIXME: Something with this is pushing over the sidebar  */}
      {/* <MovieTable data={data} selectedAttributes={["title", "release_year", "streaming_service"]} setSelectedAttributes={setSelectedAttributes} /> */}

    </div>
  );
}



