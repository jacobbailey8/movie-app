from sqlalchemy.orm import Session
from models import User
from schemas import UserCreate


def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()


def create_user_in_db(db: Session, user: User):
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
