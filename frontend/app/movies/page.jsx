'use client';
import React, { useState } from 'react';
import SearchForm from './SearchForm.jsx';
import MovieTable from './tableComponents/MovieTable.jsx'
import Table from './tableComponents/Table.jsx'
import TuneIcon from '@mui/icons-material/Tune';
import CircularProgress from '@mui/material/CircularProgress';
import MovieModal from './tableComponents/MovieModal.jsx';


export default function movies() {
  const [showForm, setShowForm] = useState(true);
  const [loading, setLoading] = useState(false);
  const [modalMovie, setModalMovie] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [selectedAttributes, setSelectedAttributes] = useState(["title", "release_year"]);

  const [movies, setMovies] = useState([

  ]);
  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState([
    { field: "type", filter: true, checkboxSelection: true }, // field: the key in the rowData object
    { field: "title", filter: true },
    { field: "director", filter: true },

  ]);
  return (
    <div className={`flex flex-col  sm:justify-between sm:pl-56 p-4 ${showForm ? 'sm:flex-row' : 'sm:flex-col'}`}>
      {showForm && <SearchForm setMovies={setMovies} setShowForm={setShowForm} setLoading={setLoading} />}
      {!showForm &&
        (<button onClick={() => setShowForm(true)} className='bg-orange-400 rounded p-2 text-slate-50 font-semibold w-44 m-6 ml-0 flex gap-1 items-center justify-center hover:opacity-80'>
          <TuneIcon />
          <div>Adjust Search</div>
        </button>)}

      {loading && <div className='w-full text-center sm:mt-44'><CircularProgress color='inherit' /></div>}
      {!loading && <Table movies={movies} setMovies={setMovies} colDefs={colDefs} setColDefs={setColDefs} setModalMovie={setModalMovie} setModalOpen={setModalOpen} />}
      {modalOpen && <MovieModal movie={modalMovie} closeModal={() => setModalOpen(false)} />}

    </div>
  );
}



