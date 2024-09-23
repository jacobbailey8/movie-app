'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef, use } from 'react'; // React Library
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import WatchlistSelectModal from './WatchlistSelectModal'; // Watchlist Select Modal Component
import ColumnSelector from './ColumnSelector'; // Column Selector Component
// import '/Users/jacobbailey/Desktop/movie-app/frontend/app/movies/tableComponents/styles/ag-grid-theme-builder.css';
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css";
import "../../../app/globals.css"
export default function Table({ movies, setMovies, colDefs, setColDefs, setModalMovie, setModalOpen }) {

    const { data: session, status } = useSession();
    const router = useRouter();

    // Pagination: The number of rows to be displayed per page.
    const [pagination, setPagination] = useState(true);
    const [paginationPageSize, setPaginationPageSize] = useState(10);
    const [paginationPageSizeSelector, setPaginationPageSizeSelector] = useState([5, 10, 15]);
    const [selections, setSelections] = useState([]);
    const [showAddMovieBtn, setShowAddMovieBtn] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [watchlists, setWatchlists] = useState([]);

    useEffect(() => {
        fetchWatchlists();
    }), []

    useEffect(() => {
        if (selections.length > 0) {
            setShowAddMovieBtn(true);
        }
        else {
            setShowAddMovieBtn(false);
        }
    }, [selections]);

    // Handle opening the modal
    const openModal = () => setIsModalOpen(true);

    // Handle closing the modal
    const closeModal = () => setIsModalOpen(false);
    const onRowClicked = (event) => {
        // get data from the row
        const movieData = event.data;
        setModalMovie(movieData);
        setModalOpen(true);


    };

    const fetchWatchlists = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/watchlists/names', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${session.accessToken}`, // Include token in Authorization header
                },
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail);
            }

            const data = await res.json();
            setWatchlists(data); // Set the watchlists in state

        } catch (error) {
            console.error(error);
        }
    };

    const handleAddMovies = async () => {

        // open watchlist select modal
        await fetchWatchlists();
        openModal();
        // fecth available watchlists


    };

    return (

        <div className='w-full'>
            <ColumnSelector colDefs={colDefs} setColDefs={setColDefs} />
            {/* // wrapping container with theme & size */}
            <div
                className={
                    'ag-theme-quartz w-full self-center max-h-[28rem] sm:max-h-[38rem] overflow-auto'
                }
            >
                <AgGridReact

                    rowData={movies}
                    columnDefs={colDefs.map(colDef => ({ ...colDef, resizable: true }))} // Make columns resizable

                    rowSelection="multiple" // Enable multiple row selection
                    suppressCellFocus={true} // Suppress the focus on cell click
                    domLayout="autoHeight" // Adjust grid height based on content
                    suppressRowClickSelection={true} // Prevent row click from affecting selection
                    onRowClicked={onRowClicked} // Manually handle row selection
                    onSelectionChanged={(event) => {

                        setSelections(event.api.getSelectedRows());

                    }}
                // paginationClassName="pagination-container flex items-center justify-center sm:justify-between px-4 py-2 space-x-2 sm:space-x-4 mt-2"
                // paginationPageSizeSelectorClassName="pagination-page-selector flex flex-wrap items-center justify-center space-x-1"
                />

            </div>

            {(showAddMovieBtn && watchlists.length > 0) && <button onClick={handleAddMovies} className='bg-neutral-800 p-4 rounded text-lg font-bold mt-6 text-slate-50'>Add To Watchlist</button>}
            {(showAddMovieBtn && watchlists.length === 0) && <button onClick={() => router.push('/')} className='bg-neutral-800 p-4 rounded text-lg font-bold mt-6 text-slate-50'>Create a watchlist</button>}
            <WatchlistSelectModal
                isOpen={isModalOpen}
                onClose={closeModal}
                watchlists={watchlists}
                movies={selections.map((movie) => movie.show_id)}


            />
        </div>
    )

}