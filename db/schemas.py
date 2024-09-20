from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date

# Users


class UserBase(BaseModel):
    username: str
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserRead(UserBase):
    id: int

    class Config:
        orm_mode = True


class UserLogin(BaseModel):
    username: str
    password: str


class SignupResponse(BaseModel):
    user: UserRead
    access_token: str
    token_type: str


# Movies
class MovieBase(BaseModel):
    type: str
    title: str
    director: Optional[str] = None
    cast: Optional[str] = None
    country: Optional[str] = None
    date_added: Optional[date] = None
    release_year: int
    rating: Optional[str] = None
    duration: Optional[float] = None
    listed_in: Optional[str] = None
    description: Optional[str] = None
    streaming_service: str
    num_seasons: Optional[int] = None


class MovieRead(MovieBase):
    show_id: int

    class Config:
        orm_mode = True


class MovieList(BaseModel):
    total: int
    movies: list[MovieRead]


class MovieTitle(BaseModel):
    title: str


class MovieGenre(BaseModel):
    genre: str


class MovieCountry(BaseModel):
    country: str


class WatchlistCreate(BaseModel):
    name: str


class WatchlistRead(BaseModel):
    id: int
    name: str
    user_id: int
    movies: List[MovieRead]

    class Config:
        orm_mode = True

# Define a Pydantic model for the request body


class MovieListRequest(BaseModel):
    watchlist_id: int
    movie_list: List[int]  # List of movie IDs
