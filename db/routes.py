from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from database import get_db
from models import Movie
from schemas import MovieCreate, MovieRead, MovieList, MovieTitle, MovieGenre, MovieCountry

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


@router.get('/movies/by-title/{title}', response_model=List[MovieTitle])
def read_movie_by_title(title: str, db: Session = Depends(get_db)):
    movies = db.query(Movie).filter(Movie.title.ilike(f"%{title}%")).all()

    # Use a set to store unique titles
    unique_titles = {movie.title for movie in movies}

    
    if movies is None:
        raise HTTPException(status_code=404, detail="No movies found with that title")
    # Return the unique titles as a list of dictionaries
    return [{"title": title} for title in unique_titles]


# get movies by form
# can search by type(show/movie) , director, actor name, country, release_year, rating, genre, streaming service


@router.get('/movies/filter/', response_model=MovieList)
def read_movies_by_form(
    show_type: str = None,
    director: str = None,
    actor: str = None,
    genre: str = None,
    country: str = None,
    streaming_service: str = None,
    min_release_year: int = None,
    max_release_year: int = None,
    skip: int = 0, 
    limit: int = 10,
    db: Session = Depends(get_db)
):
    movies = db.query(Movie)
    if show_type:
        movies = movies.filter(Movie.type == show_type)
    if director:
        movies = movies.filter(func.upper(Movie.director) == director.upper())
    if actor:
        movies = movies.filter(func.upper(Movie.cast).contains(actor.upper()))
    if genre:
        movies = movies.filter(func.upper(Movie.listed_in).contains(genre.upper()))
    if country:
        movies = movies.filter(func.upper(Movie.country) == country.upper())
    if streaming_service:
        movies = movies.filter(func.upper(Movie.streaming_service) == streaming_service.upper())
    if min_release_year:
        movies = movies.filter(Movie.release_year >= min_release_year)
    if max_release_year:
        movies = movies.filter(Movie.release_year <= max_release_year)

    total = movies.count()
    movies = movies.offset(skip).limit(limit).all()

    return {
        'total': total,
        'movies': movies
    }


# get movies by genre
@router.get('/movies/by-genre/{genre}', response_model=List[MovieGenre])
def read_movie_by_genre(genre: str, db: Session = Depends(get_db)):
    movies = db.query(Movie).filter(Movie.listed_in.ilike(f"%{genre}%")).all()

    # Use a set to store unique titles by splitting each genre by comma eg. "Action, Adventure, Comedy" -> ["Action", "Adventure", "Comedy"]
    unique_genres = {genre.strip() for movie in movies for genre in movie.listed_in.split(",")}

    
    if movies is None:
        raise HTTPException(status_code=404, detail="No movies found with that genre")
    # Return the unique titles as a list of dictionaries
    return [{"genre": genre} for genre in unique_genres]


# get movies by country
@router.get('/movies/by-country/{country}', response_model=List[MovieCountry])
def read_movie_by_country(country: str, db: Session = Depends(get_db)):
    movies = db.query(Movie).filter(Movie.country.ilike(f"%{country}%")).all()

    unique_countries = {country.strip() for movie in movies for country in movie.country.split(",")}

    
    if movies is None:
        raise HTTPException(status_code=404, detail="No movies found with that genre")
    # Return the unique titles as a list of dictionaries
    return [{"country": country} for country in unique_countries]

