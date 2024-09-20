from sqlalchemy import Column, Integer, String, Text, Date, Float, ForeignKey, Table
from sqlalchemy.orm import relationship
from database import Base

# Association table for many-to-many relationship between watchlists and movies
watchlist_movies = Table(
    'watchlist_movies',
    Base.metadata,
    Column('watchlist_id', Integer, ForeignKey(
        'watchlists.id'), primary_key=True),
    Column('movie_id', Integer, ForeignKey('movies.show_id'), primary_key=True)
)


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    # One-to-Many relationship with Watchlist
    watchlists = relationship("Watchlist", back_populates="user")


class Movie(Base):
    __tablename__ = 'movies'

    show_id = Column(Integer, primary_key=True, index=True, unique=True)
    type = Column(String, nullable=False)
    title = Column(String, nullable=False)
    director = Column(String, nullable=True)
    cast = Column(Text, nullable=True)
    country = Column(String, nullable=True)
    date_added = Column(Date, nullable=True)
    release_year = Column(Integer, nullable=True)
    rating = Column(String, nullable=True)
    duration = Column(Float, nullable=True)
    listed_in = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    streaming_service = Column(String, nullable=False)
    num_seasons = Column(Integer, nullable=True)

    # Many-to-Many relationship with Watchlist
    watchlists = relationship(
        "Watchlist", secondary=watchlist_movies, back_populates="movies")


class Watchlist(Base):
    __tablename__ = 'watchlists'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    created_at = Column(Date, nullable=False)
    last_updated = Column(Date, nullable=False)

    # Many-to-One relationship with User
    user = relationship("User", back_populates="watchlists")

    # Many-to-Many relationship with Movie
    movies = relationship(
        "Movie", secondary=watchlist_movies, back_populates="watchlists")
