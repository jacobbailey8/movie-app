import { useEffect } from 'react';

export default function WatchlistSelectModal({ isOpen, onClose }) {


    if (!isOpen) return null; // Do not render if the modal is not open
    // Prevent click events inside the modal from closing it
    const handleModalClick = (event) => {
        event.stopPropagation();
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
            <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={handleModalClick}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Select a Watchlist</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
                </div>

                <div className="mt-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
