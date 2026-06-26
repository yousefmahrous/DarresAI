from pydantic import BaseModel, EmailStr

class ParentProfileResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str

    class Config:
        from_attributes = True