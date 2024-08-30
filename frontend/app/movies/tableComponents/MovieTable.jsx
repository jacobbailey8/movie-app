'use client';
import React, { useState } from 'react';
import Modal from './Modal'; // Adjust path as needed

function MovieTable({ data, selectedAttributes, setSelectedAttributes }) {
    const handleChange = (event) => {
        setSelectedAttributes(event.target.name);
    };

    // sort state
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    // Handle sorting
    const handleSort = (attr) => {
        let direction = 'asc';
        if (sortConfig.key === attr && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key: attr, direction });
    };

    // Sort the data based on the current sort configuration
    const sortedData = React.useMemo(() => {
        if (!sortConfig.key) return data;

        const sortedArray = [...data].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
        return sortedArray;
    }, [data, sortConfig]);

    // state for the modal
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const openModal = (movie) => {
        setSelectedMovie(movie);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedMovie(null);
    };

    return (
        <>
            <table>
                <thead>
                    <tr>
                        {selectedAttributes.map((attr, index) => (
                            <th key={index}>{attr}
                                {attr}
                                <button onClick={() => handleSort(attr)}>
                                    {sortConfig.key === attr
                                        ? sortConfig.direction === 'asc'
                                            ? ' 🔼' // Ascending
                                            : ' 🔽' // Descending
                                        : ' ⏺'  // Not sorted
                                    }
                                </button>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((item, index) => (
                        <tr key={index}>
                            {selectedAttributes.map((attr) => (
                                <td key={attr}>{item[attr]}</td>
                            ))}
                            <td>
                                <button onClick={() => openModal(item)}>Details</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Popup */}
            <Modal
                show={showModal}
                onClose={closeModal}
                movie={selectedMovie}
            />
        </>
    );
}

export default MovieTable