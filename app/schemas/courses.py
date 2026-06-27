from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CourseCreate(BaseModel):
    title: str
    description: Optional[str] = None
    school_year: str

class CourseResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    school_year: str

    class Config:
        from_attributes = True
        
class LessonCreate(BaseModel):
    title: str
    content: Optional[str] = None
    order: int 

class LessonResponse(BaseModel):
    id: int
    title: str
    content: Optional[str] = None
    order: int
    course_id: int

    class Config:
        from_attributes = True
        
class ChatMessageCreate(BaseModel):
    content: str

class ChatMessageResponse(BaseModel):
    id: int
    sender: str
    content: str
    message_type: str
    created_at: datetime
    class Config:
        from_attributes = True