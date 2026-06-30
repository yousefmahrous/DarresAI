from dotenv import load_dotenv
load_dotenv(override=True)

from fastapi import FastAPI
from app.database import engine, Base
from app.models import courses, users, gamification
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, courses, gamification, parent, student

Base.metadata.create_all(bind=engine)

app = FastAPI(title="DarresAI API")

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])

@app.get("/")
def read_root():
    return {"message": "أهلا بيكم في درس AI"}

app.include_router(courses.router, prefix="/api/courses", tags=["Courses"])
app.include_router(gamification.router, prefix="/api/gamification", tags=["Gamification"])

origins = [
    "http://localhost:3000", 
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(courses.router, prefix="/api/courses", tags=["Courses"])
app.include_router(gamification.router, prefix="/api/gamification", tags=["Gamification"])
app.include_router(student.router, prefix="/api/student", tags=["Student Panel"])
app.include_router(parent.router, prefix="/api/parent", tags=["Parent Panel"])