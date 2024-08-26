import React from 'react';

const Modal = ({ show, onClose, movie }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-md w-full">
                <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl"
                    onClick={onClose}
                >
                    &times;
                </button>
                <h2 className="text-xl font-semibold mb-2 text-gray-900">{movie.title}</h2>
                <p className="text-gray-700">{movie.description}</p>
            </div>
        </div>
    );
};

export default Modal;
