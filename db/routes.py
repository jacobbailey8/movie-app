from fastapi import FastAPI
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from database import get_db
from models import Movie, User
from schemas import MovieRead, MovieList, MovieTitle, MovieGenre, MovieCountry, UserRead, UserCreate, UserLogin, SignupResponse
from auth import authenticate_user, create_access_token, get_password_hash
from crud import get_user_by_username
from datetime import timedelta
import requests
import os
from dotenv import load_dotenv
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk import pos_tag
from collections import Counter
import string
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env.local')
load_dotenv(dotenv_path)


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
        raise HTTPException(
            status_code=404, detail="No movies found with that title")
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
        movies = movies.filter(func.upper(
            Movie.listed_in).contains(genre.upper()))
    if country:
        movies = movies.filter(func.upper(Movie.country) == country.upper())
    if streaming_service:
        movies = movies.filter(func.upper(
            Movie.streaming_service) == streaming_service.upper())
    if min_release_year:
        movies = movies.filter(Movie.release_year >= min_release_year)
    if max_release_year:
        movies = movies.filter(Movie.release_year <= max_release_year)

    total = movies.count()
    movies = movies.offset(skip).all()

    return {
        'total': total,
        'movies': movies
    }


# get movies by genre
@router.get('/movies/by-genre/{genre}', response_model=List[MovieGenre])
def read_movie_by_genre(genre: str, db: Session = Depends(get_db)):
    movies = db.query(Movie).filter(Movie.listed_in.ilike(f"%{genre}%")).all()

    # Use a set to store unique titles by splitting each genre by comma eg. "Action, Adventure, Comedy" -> ["Action", "Adventure", "Comedy"]
    unique_genres = {genre.strip()
                     for movie in movies for genre in movie.listed_in.split(",")}

    if movies is None:
        raise HTTPException(
            status_code=404, detail="No movies found with that genre")
    # Return the unique titles as a list of dictionaries
    return [{"genre": genre} for genre in unique_genres]


# get movies by country
@router.get('/movies/by-country/{country}', response_model=List[MovieCountry])
def read_movie_by_country(country: str, db: Session = Depends(get_db)):
    movies = db.query(Movie).filter(Movie.country.ilike(f"%{country}%")).all()

    unique_countries = {country.strip()
                        for movie in movies for country in movie.country.split(",")}

    if movies is None:
        raise HTTPException(
            status_code=404, detail="No movies found with that genre")
    # Return the unique titles as a list of dictionaries
    return [{"country": country} for country in unique_countries]


# USER ROUTES
@router.post("/auth/signup", response_model=SignupResponse)
def create_user_route(response: Response, user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(
            status_code=400, detail="Username already registered")
    hashed_password = get_password_hash(user.password)
    new_user = User(username=user.username, email=user.email,
                    hashed_password=hashed_password)

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create JWT token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": new_user.username}, expires_delta=access_token_expires
    )

    # Set the JWT as a cookie
    response.set_cookie(key="access_token",
                        value=f"Bearer {access_token}", httponly=True)

    # Manually create the UserRead object
    user_read = UserRead(
        id=new_user.id,
        username=new_user.username,
        email=new_user.email
    )

    # Return the response with the user object and the token
    return SignupResponse(
        user=user_read,
        access_token=access_token,
        token_type="bearer"
    )


@router.post("/auth/login")
def login_user(user: UserLogin, db: Session = Depends(get_db)):
    db_user = authenticate_user(
        db, username=user.username, password=user.password)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": db_user.username})
    return {"access_token": access_token, "token_type": "bearer"}


# tag movie reviews
@router.get("/reviews/movie")
def tag_movie_reviews(movie_id: int):

    url = f"https://api.themoviedb.org/3/movie/{movie_id}/reviews?language=en-US&page=1"
    headers = {
        "accept": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjliNjQxN2Y0ZjkzZDQwMTNlNjRjMDNhZDg4YjYxMSIsIm5iZiI6MTcyNjU1MzE0Ni40MzExMjMsInN1YiI6IjY2ZDFmZmQwYjYzZTMyNTkyNDliOGYyOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.cUT8CImCwdd1tm8yg0tSUlS4FOK9Y99848-dFnUknCI"
    }

    response = requests.get(url, headers=headers)
    array_full_data = response.json()["results"]

    # map arrary to each content attribute
    # this is now an array of text reviews
    reviews = list(map(lambda x: x["content"], array_full_data))

    # Preprocessing function
    def preprocess_review(review):
        tokens = word_tokenize(review.lower())
        # Remove punctuation and non-alpha
        tokens = [word for word in tokens if word.isalpha()]
        stop_words = set(stopwords.words('english'))
        return [word for word in tokens if word not in stop_words]

    # Extract adjectives
    def extract_adjectives(tokens):
        pos_tags = pos_tag(tokens)
        adjectives = [word for word,
                      pos in pos_tags if pos in ['JJ', 'JJS']]
        return adjectives

    # Process all reviews
    all_adjectives = []
    for review in reviews:
        tokens = preprocess_review(review)
        adjectives = extract_adjectives(tokens)
        all_adjectives.extend(adjectives)

    # Count most common adjectives
    adj_freq = Counter(all_adjectives)
    common_adjectives = adj_freq.most_common(5)

    # return only the words
    return [word for word, freq in common_adjectives]


# tag series reviews


@router.get("/reviews/tv")
def tag_movie_reviews(movie_id: int):
    url = f"https://api.themoviedb.org/3/tv/{movie_id}/reviews?language=en-US&page=1"
    headers = {
        "accept": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjliNjQxN2Y0ZjkzZDQwMTNlNjRjMDNhZDg4YjYxMSIsIm5iZiI6MTcyNjU1MzE0Ni40MzExMjMsInN1YiI6IjY2ZDFmZmQwYjYzZTMyNTkyNDliOGYyOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.cUT8CImCwdd1tm8yg0tSUlS4FOK9Y99848-dFnUknCI"
    }

    response = requests.get(url, headers=headers)
    array_full_data = response.json()["results"]

    # map arrary to each content attribute
    # this is now an array of text reviews
    reviews = list(map(lambda x: x["content"], array_full_data))

    # Preprocessing function
    def preprocess_review(review):
        tokens = word_tokenize(review.lower())
        # Remove punctuation and non-alpha
        tokens = [word for word in tokens if word.isalpha()]
        stop_words = set(stopwords.words('english'))
        return [word for word in tokens if word not in stop_words]

    # Extract adjectives
    def extract_adjectives(tokens):
        pos_tags = pos_tag(tokens)
        adjectives = [word for word,
                      pos in pos_tags if pos in ['JJ', 'JJS']]
        return adjectives

    # Process all reviews
    all_adjectives = []
    for review in reviews:
        tokens = preprocess_review(review)
        adjectives = extract_adjectives(tokens)
        all_adjectives.extend(adjectives)

    # Count most common adjectives
    adj_freq = Counter(all_adjectives)
    common_adjectives = adj_freq.most_common(5)

    # return only the words
    return [word for word, freq in common_adjectives]
