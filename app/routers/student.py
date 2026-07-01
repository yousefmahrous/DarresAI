from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid

from app.database import get_db
from app.models.users import User, StudentParentRelation
from app.models.gamification import Gamification
from app.routers.auth import get_current_user
from app.schemas.student import StudentProfileResponse
from app.models.courses import LessonChatMessage
from sqlalchemy import desc
from sqlalchemy.exc import IntegrityError

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
    
    try:
        db.commit()
        return {"link_code": new_code}
    except IntegrityError:
        # لو حصل ضربتين في نفس اللحظة، اعمل تراجع وهات الكود اللي اتحفظ في الضربة الأولى
        db.rollback()
        relation = db.query(StudentParentRelation).filter(StudentParentRelation.student_id == current_user.id).first()
        return {"link_code": relation.link_code}

@router.get("/profile", response_model=StudentProfileResponse)
def get_student_profile(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="هذا المسار للطلاب فقط!")
        
    gamification = db.query(Gamification).filter(Gamification.student_id == current_user.id).first()
    
    # التعديل هنا: الستريك بيبدأ من 1 للطالب الجديد
    streak_val = gamification.streak if gamification and gamification.streak > 0 else 1
    points_val = gamification.points if gamification else 0
    
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "streak": streak_val,
        "points": points_val,
        "last_active_date": gamification.last_active_date if gamification else None
    }

@router.get("/activity")
def get_recent_activity(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="هذا المسار للطلاب فقط!")
    
    # هنجيب آخر 4 رسايل الطالب بعتها للـ AI كمثال للنشاط
    recent_chats = db.query(LessonChatMessage).filter(
        LessonChatMessage.user_id == current_user.id,
        LessonChatMessage.sender == "user"
    ).order_by(desc(LessonChatMessage.created_at)).limit(4).all()
    
    activities = []
    for chat in recent_chats:
        activities.append({
            "id": chat.id,
            "type": "chat",
            "title": "AI Tutor Session",
            "description": f"Asked: {chat.content[:30]}...", # بناخد أول 30 حرف من السؤال
            "time": chat.created_at.strftime("%I:%M %p"), # بننسق الوقت
            "color": "bg-blue-600"
        })
        
    # لو مفيش أنشطة خالص، نرجع داتا مبدئية عشان الـ UI ميبقاش فاضي يوم العرض
    if not activities:
        return [
            {
                "id": 1,
                "type": "system",
                "title": "Account Created",
                "description": "Welcome to DARES-AI platform!",
                "time": "Today",
                "color": "bg-green-600"
            }
        ]
        
    return activities