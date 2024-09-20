'use client';
import React, { useState, useEffect, useRef, use } from 'react'; // React Library
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import WatchlistSelectModal from './WatchlistSelectModal'; // Watchlist Select Modal Component
// import "ag-grid-community/styles/ag-grid.css"; // Mandatory
import '/Users/jacobbailey/Desktop/movie-app/frontend/app/movies/tableComponents/styles/ag-grid-theme-builder.css';


export default function Table({ movies, setMovies, colDefs, setColDefs, setModalMovie, setModalOpen }) {


    // Pagination: The number of rows to be displayed per page.
    const [pagination, setPagination] = useState(true);
    const [paginationPageSize, setPaginationPageSize] = useState(10);
    const [paginationPageSizeSelector, setPaginationPageSizeSelector] = useState([5, 10, 15]);
    const [selections, setSelections] = useState([]);
    const [showAddMovieBtn, setShowAddMovieBtn] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);



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

    const handleAddMovies = () => {

        // open watchlist select modal
        openModal();



        console.log(selections);
    }

    return (
        <div className='w-full'>
            {/* // wrapping container with theme & size */}
            <div
                className={
                    'ag-theme-grid-builder w-full self-center max-h-[28rem] sm:max-h-[38rem] overflow-auto'
                }
            >
                <AgGridReact

                    rowData={movies}
                    columnDefs={colDefs.map(colDef => ({ ...colDef, resizable: true }))} // Make columns resizable
                    // pagination={pagination}
                    // paginationPageSize={paginationPageSize}
                    // paginationPageSizeSelector={paginationPageSizeSelector}
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

            {showAddMovieBtn && <button onClick={handleAddMovies} className='bg-orange-400 p-4 rounded text-lg font-bold mt-6 text-slate-50'>Add To Watchlist</button>}
            <WatchlistSelectModal
                isOpen={isModalOpen}
                onClose={closeModal}


            />
        </div>
    )

}