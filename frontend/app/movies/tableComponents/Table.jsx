'use client';
import React, { useState, useEffect, useRef } from 'react'; // React Library
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
// import "ag-grid-community/styles/ag-grid.css"; // Mandatory
import '/Users/jacobbailey/Desktop/movie-app/frontend/app/movies/tableComponents/styles/ag-grid-theme-builder.css';


export default function Table({ movies, setMovies, colDefs, setColDefs, setModalMovie, setModalOpen }) {

    // const gridRef = useRef();

    // useEffect(() => {
    //     if (gridRef.current) {
    //         gridRef.current.api.sizeColumnsToFit();
    //     }
    // }, [movies]);

    // Pagination: The number of rows to be displayed per page.
    const [pagination, setPagination] = useState(true);
    const [paginationPageSize, setPaginationPageSize] = useState(5);
    const [paginationPageSizeSelector, setPaginationPageSizeSelector] = useState([5, 10, 15]);
    // Row Data: The data to be displayed.

    const onRowClicked = (event) => {
        // get data from the row
        const movieData = event.data;
        setModalMovie(movieData);
        setModalOpen(true);


    };

    return (
        // wrapping container with theme & size
        <div
            className={
                'ag-theme-grid-builder w-full self-center max-h-[28rem] sm:max-h-[38rem] overflow-auto'
            }
        // style={{ height: 500 }}
        >
            <AgGridReact
                // ref={gridRef}

                rowData={movies}
                columnDefs={colDefs.map(colDef => ({ ...colDef, resizable: true }))} // Make columns resizable
                pagination={pagination}
                paginationPageSize={paginationPageSize}
                paginationPageSizeSelector={paginationPageSizeSelector}
                rowSelection="multiple" // Enable multiple row selection
                suppressCellFocus={true} // Suppress the focus on cell click
                domLayout="autoHeight" // Adjust grid height based on content
                suppressRowClickSelection={true} // Prevent row click from affecting selection

                // onGridReady={() => {
                //     gridRef.current.api.sizeColumnsToFit(); // Auto-size columns to fit content on grid ready
                // }}
                onRowClicked={onRowClicked} // Manually handle row selection
                onSelectionChanged={(event) => {
                    const selectedRows = event.api.getSelectedRows();
                    console.log('Selected Rows:', selectedRows);
                }}
            // paginationClassName="pagination-container flex items-center justify-center sm:justify-between px-4 py-2 space-x-2 sm:space-x-4 mt-2"
            // paginationPageSizeSelectorClassName="pagination-page-selector flex flex-wrap items-center justify-center space-x-1"
            />

        </div>
    )

}