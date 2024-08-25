from pydantic import BaseModel
from typing import Optional
from datetime import date


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


class MovieCreate(MovieBase):
    pass


class MovieRead(MovieBase):
    show_id: int

    class Config:
        orm_mode = True

class MovieList(BaseModel):
    total: int
    movies: list[MovieRead]