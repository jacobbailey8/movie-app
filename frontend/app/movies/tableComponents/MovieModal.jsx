'use client';
import React, { useEffect } from 'react';


export default function Modal({ movie, closeModal }) {

    useEffect(() => {
        async function fetchData() {
            if (movie) {

                console.log(movie.title)
                try {

                } catch (error) {
                    console.error(error)


                }
            }
        }
        fetchData();
    }, [movie]);

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };


    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleOverlayClick}
        >
            <div
                className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full"
                onClick={(e) => e.stopPropagation()} // Prevent modal click from triggering overlay click
            >
                <h2 className="text-lg font-bold mb-4">Modal Title</h2>
                <p>This is the modal content.</p>
                <button
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                    onClick={closeModal}
                >
                    Close Modal
                </button>
            </div>
        </div>
    );
}
