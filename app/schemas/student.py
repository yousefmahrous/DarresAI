from pydantic import BaseModel, EmailStr
from datetime import date

class LinkStudentRequest(BaseModel):
    link_code: str

class StudentProgressReport(BaseModel):
    student_name: str
    total_points: int
    current_streak: int
    completed_lessons_count: int

class StudentProfileResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    streak: int
    points: int
    last_active_date: date | None

    class Config:
        from_attributes = True