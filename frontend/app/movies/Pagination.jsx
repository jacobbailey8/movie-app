

function Pagination({ currentPage = 1, totalPages = 1 }) {
    return (
        <div className="flex gap-4">
            <button className="text-black bg-white p-4 ">Previous</button>
            <button className="text-black bg-white p-4 ">Next</button>
            <div>{currentPage}/{totalPages}</div>
        </div>
    )
}

export default Pagination