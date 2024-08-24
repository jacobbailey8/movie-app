from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from database import get_db
from models import Movie
from schemas import MovieCreate, MovieRead

router = APIRouter()


# Get a list of all movies
@router.get("/movies/", response_model=List[MovieRead])
def read_movies(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    movies = db.query(Movie).offset(skip).limit(limit).all()
    return movies

# Get a specific movie by ID


@router.get("/movies/by-id/{movie_id}", response_model=MovieRead)
def read_movie(movie_id: int, db: Session = Depends(get_db)):
    movie = db.query(Movie).filter(Movie.show_id == movie_id).first()
    if movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    return movie

# Get a movie by title


@router.get('/movies/by-title/{title}', response_model=MovieRead)
def read_movie_by_title(title: str, db: Session = Depends(get_db)):
    movie = db.query(Movie).filter(func.upper(
        Movie.title) == title.upper()).first()
    if movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    return movie

# get movies by form
# can search by type(show/movie) , director, actor name, country, release_year, rating, genre, streaming service


@router.get('/movies/filter/', response_model=List[MovieRead])
def read_movies_by_form(
    show_type: str = None,
    director: str = None,
    actor_name: str = None,
    country: str = None,
    release_year: int = None,
    rating: str = None,
    genre: str = None,
    streaming_service: str = None,
    db: Session = Depends(get_db)
):
    movies = db.query(Movie)
    if show_type:
        movies = movies.filter(Movie.type == show_type)
    # if director:
    #     movies = movies.filter(func.upper(Movie.director) == director.upper())
    # if actor_name:
    #     movies = movies.filter(func.upper(Movie.cast).contains(actor_name.upper()))
    # if country:
    #     movies = movies.filter(func.upper(Movie.country) == country.upper())
    # if release_year:
    #     movies = movies.filter(Movie.release_year == release_year)
    # if rating:
    #     movies = movies.filter(Movie.rating == rating)
    # if genre:
    #     movies = movies.filter(func.upper(Movie.listed_in) == genre.upper())
    # if streaming_service:
    #     movies = movies.filter(func.upper(Movie.streaming_service) == streaming_service.upper())
    return movies.all()
