from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from database import get_db
from models import Movie, User, Watchlist
from schemas import WatchlistName, MovieRead, MovieList, MovieTitle, MovieGenre, MovieCountry, UserRead, UserCreate, UserLogin, SignupResponse, WatchlistCreate, WatchlistRead, MovieListRequest
from auth import authenticate_user, create_access_token, get_password_hash, get_current_user, get_user_by_username, get_user_by_email
from nlp import get_sentiment, extract_phrases, clean_review_text
from datetime import timedelta
import requests
import os
import re
from dotenv import load_dotenv
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk import pos_tag
from collections import Counter
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
            status_code=400, detail="Username already exists")
    db_user = get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=400, detail="Email already registered")

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

    # Process all reviews
    all_phrases = []
    sentiment_scores = []
    for review in reviews:
        # Clean each review text
        cleaned_review = clean_review_text(review)

        sentiment_score = get_sentiment(cleaned_review)
        sentiment_scores.append(sentiment_score)
        phrases = extract_phrases(cleaned_review)
        all_phrases.extend(phrases)

    # Get the overall sentiment of the reviews
    avg_sentiment = sum(sentiment_scores) / len(sentiment_scores)
    sen = ""
    if avg_sentiment >= 0.65:
        sen = "Positive"
    elif avg_sentiment <= 0.35:
        sen = "Negative"
    else:
        sen = "Neutral"

    # Count most common adjective-noun phrases
    phrase_freq = Counter(all_phrases)
    common_phrases = phrase_freq.most_common(5)
    tags = [phrase for phrase, freq in common_phrases]

    # Return most common sentiment-based phrases
    return {'tags': tags, 'sentiment': sen}


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

    # Process all reviews
    all_phrases = []
    sentiment_scores = []
    for review in reviews:
        # Clean each review text
        cleaned_review = clean_review_text(review)

        sentiment_score = get_sentiment(cleaned_review)
        sentiment_scores.append(sentiment_score)
        phrases = extract_phrases(cleaned_review)
        all_phrases.extend(phrases)

    # Get the overall sentiment of the reviews
    avg_sentiment = sum(sentiment_scores) / len(sentiment_scores)
    sen = ""
    if avg_sentiment >= 0.1:
        sen = "Positive"
    elif avg_sentiment <= -0.1:
        sen = "Negative"
    else:
        sen = "Neutral"

    # Count most common adjective-noun phrases
    phrase_freq = Counter(all_phrases)
    common_phrases = phrase_freq.most_common(5)
    tags = [phrase for phrase, freq in common_phrases]

    # Return most common sentiment-based phrases
    return {'tags': tags, 'sentiment': sen}


@router.post("/watchlists/", response_model=WatchlistRead)
def create_watchlist(
    watchlist: WatchlistCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if the user already has a watchlist with the same name
    existing_watchlist = db.query(Watchlist).filter(
        Watchlist.name == watchlist.name, Watchlist.user_id == current_user.id).first()
    if existing_watchlist:
        raise HTTPException(
            status_code=400, detail="Watchlist with this name already exists")

    # Create the new watchlist
    new_watchlist = Watchlist(
        name=watchlist.name,
        user_id=current_user.id,
        created_at=func.now(),
        last_updated=func.now()
    )

    db.add(new_watchlist)
    db.commit()
    db.refresh(new_watchlist)

    return new_watchlist


# Route to get all watchlists for the current user
@router.get("/watchlists/", response_model=List[WatchlistRead])
def get_watchlists(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Query the database for all watchlists associated with the current user
    watchlists = db.query(Watchlist).filter(
        Watchlist.user_id == current_user.id).all()

    # If no watchlists are found, return an empty list or raise an exception if desired
    if not watchlists:
        raise HTTPException(
            status_code=404, detail="No watchlists found for the user")

    return watchlists


@router.post("/watchlists/add/movies")
def add_movies_to_watchlists(
    body: MovieListRequest,  # Accept the request body as a Pydantic model
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    added_movies = {}
    skipped_movies = {}

    # Iterate over each watchlist ID in the request
    for watchlist_id in body.watchlist_ids:
        # Query the watchlist that belongs to the current user
        watchlist = db.query(Watchlist).filter(
            Watchlist.id == watchlist_id,
            Watchlist.user_id == current_user.id
        ).first()

        if not watchlist:
            # Watchlist not found or does not belong to the user, skip it
            continue

        added_movies[watchlist_id] = []
        skipped_movies[watchlist_id] = []

        # Iterate over the list of movies to add to this watchlist
        for movie_id in body.movie_list:
            # Query the movie by its ID
            movie = db.query(Movie).filter(Movie.show_id == movie_id).first()

            if not movie:
                skipped_movies[watchlist_id].append(
                    movie_id)  # Movie not found
                continue

            # Check if the movie is already in the watchlist
            if movie in watchlist.movies:
                # Movie already exists in the watchlist
                skipped_movies[watchlist_id].append(movie_id)
            else:
                watchlist.movies.append(movie)  # Add movie to the watchlist
                added_movies[watchlist_id].append(movie_id)

    # Commit the changes to the database
    db.commit()

    return {
        "message": "Movies processed",
        "added_movies": added_movies,
        "skipped_movies": skipped_movies
    }

# Route to get all watchlists name and ids for the current user


@router.get("/watchlists/names", response_model=List[WatchlistName])
def get_watchlists(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Query the database for all watchlists associated with the current user
    watchlists = db.query(Watchlist).filter(
        Watchlist.user_id == current_user.id).all()

    # If no watchlists are found, return an empty list or raise an exception if desired
    if not watchlists:
        raise HTTPException(
            status_code=404, detail="No watchlists found for the user")

    return watchlists


@router.delete("/watchlists/{watchlist_id}/movies/{movie_id}")
def delete_movie_from_watchlist(
    watchlist_id: int,
    movie_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Query the watchlist that belongs to the current user
    watchlist = db.query(Watchlist).filter(
        Watchlist.id == watchlist_id,
        Watchlist.user_id == current_user.id
    ).first()

    if not watchlist:
        raise HTTPException(
            status_code=404, detail="Watchlist not found or does not belong to the user"
        )

    # Query the movie by its ID
    movie = db.query(Movie).filter(Movie.show_id == movie_id).first()

    if not movie:
        raise HTTPException(
            status_code=404, detail="Movie not found"
        )

    # Check if the movie is in the watchlist
    if movie not in watchlist.movies:
        raise HTTPException(
            status_code=400, detail="Movie not in the watchlist"
        )

    # Remove the movie from the watchlist
    watchlist.movies.remove(movie)

    # Commit the changes to the database
    db.commit()

    return {"message": "Movie removed from watchlist"}


@router.delete("/watchlists/delete/{watchlist_id}")
def delete_watchlist(
    watchlist_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Query the watchlist that belongs to the current user
    watchlist = db.query(Watchlist).filter(
        Watchlist.id == watchlist_id,
        Watchlist.user_id == current_user.id
    ).first()

    if not watchlist:
        raise HTTPException(
            status_code=404, detail="Watchlist not found or does not belong to the user"
        )

    # Delete the watchlist
    db.delete(watchlist)

    # Commit the changes to the database
    db.commit()

    return {"message": "Watchlist deleted successfully"}


# route to get recommended movies based on user watchlist
@router.get("/watchlists/recommendations/{watchlist_id}")
def get_recommendations(
    watchlist_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Query the watchlist that belongs to the current user
    watchlist = db.query(Watchlist).filter(
        Watchlist.id == watchlist_id,
        Watchlist.user_id == current_user.id
    ).first()

    if not watchlist:
        raise HTTPException(
            status_code=404, detail="Watchlist not found or does not belong to the user"
        )

    # get the tmdb id of the movies in the watchlist
    headers = {
        "accept": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjliNjQxN2Y0ZjkzZDQwMTNlNjRjMDNhZDg4YjYxMSIsIm5iZiI6MTcyNjk3OTM2MS40NzczMDksInN1YiI6IjY2ZDFmZmQwYjYzZTMyNTkyNDliOGYyOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZE7_mvYX74boydtRkMqw_jRXhLIxJxt4LKCNyw4w-tI"
    }

    movie_tmdb_ids = []
    for movie in watchlist.movies:
        if movie.type == "Movie":
            url = f"https://api.themoviedb.org/3/search/movie?query={movie.title}&include_adult=false&language=en-US&page=1"
        else:
            url = f"https://api.themoviedb.org/3/search/tv?query={movie.title}&include_adult=false&language=en-US&page=1"

        try:
            response = requests.get(url, headers=headers)
            response_data = response.json()

            # Check if "results" exist and are non-empty
            if "results" not in response_data or not response_data["results"]:
                raise HTTPException(
                    status_code=404, detail=f"TMDB did not return results for {movie.title}")

            movie_tmdb_ids.append(
                {'id': response_data["results"][0]["id"], 'title': movie.title, 'type': movie.type})

        except Exception as e:
            raise HTTPException(
                status_code=404, detail=f"Could not get TMDB ID for movie {movie.title}: {str(e)}")

    # Get recommendations
    recommendations_final = []
    for movie in movie_tmdb_ids:
        if movie["type"] == "Movie":
            url = f"https://api.themoviedb.org/3/movie/{movie['id']}/recommendations?language=en-US&page=1"
        else:
            url = f"https://api.themoviedb.org/3/tv/{movie['id']}/recommendations?language=en-US&page=1"

        try:
            response = requests.get(url, headers=headers)
            response_data = response.json()

            # Check if "results" exist and are non-empty
            if "results" in response_data and response_data["results"]:
                # Append movie id, title, and type from the results
                recommendations_final.extend([{
                    "id": rec["id"],
                    "title": rec["title"] if "title" in rec else rec["name"],
                    # Propagating the type (Movie/TV) from original list
                    "type": movie["type"]
                } for rec in response_data["results"]])
            else:
                raise HTTPException(
                    status_code=404, detail=f"No recommendations found for movie {movie['id']}")

        except Exception as e:
            raise HTTPException(
                status_code=404, detail=f"Could not get recommendations for movie {movie['id']}: {str(e)}")

    # Find the counts of each movie by id, title, and type
    movie_counts = Counter([(rec["id"], rec["title"], rec["type"])
                           for rec in recommendations_final])

    # Get the top 5 recommendations
    top_5 = movie_counts.most_common(10)

    # Convert the list of tuples into a list of dictionaries with id, title, type, and count
    top_5_dict = [{"movie_id": movie_id, "title": title, "type": type_,
                   "count": count} for (movie_id, title, type_), count in top_5]

    return {'top_5': top_5_dict}
