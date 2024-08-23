from fastapi import FastAPI
from .database import engine
from .routes import router

app = FastAPI()

# No need to create tables since they already exist
# Base.metadata.create_all(bind=engine)

# Include the movie routes
app.include_router(router, prefix="/api")


@app.get("/")
def read_root():
    return {"message": "Welcome to the Movie API"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
