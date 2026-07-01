from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.users import User, StudentParentRelation
from app.models.courses import LessonProgress
from app.models.gamification import Gamification
from app.routers.auth import get_current_user
from app.schemas.student import LinkStudentRequest, StudentProgressReport
from app.schemas.parent import ParentProfileResponse

router = APIRouter()

@router.post("/link-student")
def link_student_to_parent(req: LinkStudentRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "parent":
        raise HTTPException(status_code=403, detail="الحساب ده مش حساب ولي أمر!")

    relation = db.query(StudentParentRelation).filter(StudentParentRelation.link_code == req.link_code).first()
    if not relation:
        raise HTTPException(status_code=404, detail="الكود ده غلط أو مش موجود!")
        
    relation.parent_id = current_user.id
    db.commit()
    return {"message": "تم ربط حساب ابنك بنجاح!"}

# 2. API لولي الأمر: رؤية تقرير مستوى الابن المربوط به
@router.get("/student-report", response_model=StudentProgressReport)
def get_student_report(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "parent":
        raise HTTPException(status_code=403, detail="الحساب ده مش حساب ولي أمر!")

    relation = db.query(StudentParentRelation).filter(StudentParentRelation.parent_id == current_user.id).first()
    if not relation:
        raise HTTPException(status_code=400, detail="أنت لسه مربطتش حساب ابنك!")

    student = db.query(User).filter(User.id == relation.student_id).first()
    gamification = db.query(Gamification).filter(Gamification.student_id == student.id).first()
    lessons_count = db.query(LessonProgress).filter(LessonProgress.user_id == student.id).count()

    # التعديل هنا: مطابقة الستريك والنقاط
    streak_val = gamification.streak if gamification and gamification.streak > 0 else 1
    points_val = gamification.points if gamification else 0

    return {
        "student_name": student.name,
        "total_points": points_val,
        "current_streak": streak_val,
        "completed_lessons_count": lessons_count
    }