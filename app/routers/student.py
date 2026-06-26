from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid

from app.database import get_db
from app.models.users import User, StudentParentRelation
from app.models.gamification import Gamification
from app.routers.auth import get_current_user
from app.schemas.student import StudentProfileResponse

router = APIRouter()

@router.get("/get-code")
def get_parent_link_code(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="الخدمة دي للطلاب بس!")
        
    relation = db.query(StudentParentRelation).filter(StudentParentRelation.student_id == current_user.id).first()
    if relation:
        return {"link_code": relation.link_code}
        
    new_code = str(uuid.uuid4())[:6].upper()
    relation = StudentParentRelation(student_id=current_user.id, link_code=new_code)
    db.add(relation)
    db.commit()
    return {"link_code": new_code}

@router.get("/profile", response_model=StudentProfileResponse)
def get_student_profile(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="هذا المسار للطلاب فقط!")
        
    gamification = db.query(Gamification).filter(Gamification.student_id == current_user.id).first()
    
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "streak": gamification.streak if gamification else 0,
        "points": gamification.points if gamification else 0,
        "last_active_date": gamification.last_active_date if gamification else None
    }