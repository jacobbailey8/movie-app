import CloseIcon from '@mui/icons-material/Close';

function MovieRow({ movie }) {
    return (
        <div className="flex items-center justify-between">
            <div>{movie.title}</div>

            <CloseIcon />


        </div>
    )
}

export default MovieRow