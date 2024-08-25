from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
import pandas as pd

# Load the cleaned data
# df = pd.read_csv('../csv/cleaned_data.csv')


SQLALCHEMY_DATABASE_URL = 'postgresql://postgres:Samuel1121@db-movie-app-instance-1.cb4isekyea6v.us-east-2.rds.amazonaws.com:5432/postgres'

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