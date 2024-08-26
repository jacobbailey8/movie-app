'use client';
import React from 'react';

function MovieTable({ data, selectedAttributes, setSelectedAttributes }) {
    const handleChange = (event) => {
        setSelectedAttributes(event.target.name);
    };
    return (
        <table>
            <thead>
                <tr>
                    {selectedAttributes.map((attr, index) => (
                        <th key={index}>{attr}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => (
                    <tr key={index}>
                        {selectedAttributes.map((attr) => (
                            <td key={attr}>{item[attr]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default MovieTable