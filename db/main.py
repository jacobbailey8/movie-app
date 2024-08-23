from fastapi import FastAPI
# from .database import engine
from routes import router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# No need to create tables since they already exist
# Base.metadata.create_all(bind=engine)

# Include the movie routes
app.include_router(router, prefix="/api")
origins = [
    "http://localhost:3000",

]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows specific origins
    allow_credentials=True,  # Allows cookies and authentication headers
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)


@app.get("/")
def read_root():
    return {"message": "Welcome to the Movie API"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",  # Replace "main" with your module name if different
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
