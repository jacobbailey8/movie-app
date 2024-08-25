from sqlalchemy import Column, Integer, String, Text, Date, Float
from sqlalchemy.orm import relationship
from database import Base


class Movie(Base):
    __tablename__ = 'movies'

    show_id = Column(Integer, primary_key=True, index=True)
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
