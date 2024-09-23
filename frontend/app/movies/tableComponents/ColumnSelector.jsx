import { useState, useEffect } from "react";

function ColumnSelector({ colDefs, setColDefs }) {
    // Full predefined list of columns
    const fullColumnList = [
        { field: "title", filter: true, checkboxSelection: true },
        { field: "type", filter: true },
        { field: "director", filter: true },
        { field: "cast", filter: true },
        { field: "country", filter: true },
        { field: "release_year", filter: true },
        { field: "rating", filter: true },
        { field: "duration", filter: true },
        { field: "listed_in", filter: true },
        { field: "streaming_service", filter: true },
        { field: "num_seasons", filter: true },
    ];

    // Set initial state to reflect selected columns from colDefs
    const [isOpen, setIsOpen] = useState(false);
    const [selectedColumns, setSelectedColumns] = useState(
        fullColumnList.map((col) => ({
            ...col,
            selected: colDefs.some((def) => def.field === col.field),
        }))
    );

    // Update the state when colDefs prop changes
    useEffect(() => {
        setSelectedColumns(
            fullColumnList.map((col) => ({
                ...col,
                selected: colDefs.some((def) => def.field === col.field),
            }))
        );
    }, [colDefs]);

    const handleCheckboxChange = (index) => {
        const updatedColumns = [...selectedColumns];
        updatedColumns[index].selected = !updatedColumns[index].selected;
        setSelectedColumns(updatedColumns);
    };

    const handleSave = () => {
        const updatedColDefs = selectedColumns.filter(col => col.selected);
        setColDefs(updatedColDefs);
        setIsOpen(false);
    };

    return (
        <div className="flex flex-col items-start">
            {!isOpen && (
                <button
                    className="bg-neutral-800 text-white py-2 px-4 rounded hover:bg-neutral-600 transition-colors my-4"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    Adjust Columns
                </button>
            )}

            {isOpen && (
                <div className="mt-2 bg-neutral-200 border border-neutral-200 rounded p-4 max-w-screen">
                    <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-screen">
                        {selectedColumns.map((col, index) => (
                            <li key={col.field}>
                                <label className="flex items-center space-x-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={col.selected}
                                        onChange={() => handleCheckboxChange(index)}
                                        className="appearance-none h-5 w-5 border border-gray-300 rounded-md checked:bg-orange-300 checked:border-transparent focus:outline-none cursor-pointer !important"
                                    />
                                    <span className="text-lg">{col.field}</span>
                                </label>
                            </li>
                        ))}
                    </ul>
                    <button
                        className="mt-4 bg-neutral-800 text-white py-2 px-4 rounded hover:bg-neutral-600 transition-colors"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                </div>
            )}
        </div>
    );
}

export default ColumnSelector;
