from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
import pandas as pd

# Load the cleaned data
# df = pd.read_csv('../csv/cleaned_data.csv')


SQLALCHEMY_DATABASE_URL = 'postgresql://jacobbailey:Samuel1121@localhost:5432/movie_app'

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Load the cleaned data into the database
# df.to_sql('movies', engine, if_exists='replace', index=False)
