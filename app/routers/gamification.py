from sqlalchemy.orm import Session
from typing import List
from app.schemas.gamification import LeaderboardUser
from fastapi import APIRouter, Depends, status, HTTPException  # ضفنا HTTPException هنا
from datetime import date, timedelta
from app.database import get_db
from app.models.gamification import Gamification
from app.routers.auth import get_current_user
from app.models.users import User
from app.services.streak_manager import calculate_and_update_streak

router = APIRouter()

@router.get("/leaderboard", response_model=List[LeaderboardUser])
def get_leaderboard(db: Session = Depends(get_db)):
    top_students = db.query(User.name, Gamification.points)\
        .join(Gamification, User.id == Gamification.student_id)\
        .filter(User.role == "student")\
        .order_by(Gamification.points.desc())\
        .limit(10)\
        .all()
        
    leaderboard_data = []
    for rank, (name, points) in enumerate(top_students, start=1):
        leaderboard_data.append({
            "rank": rank,
            "name": name,
            "points": points
        })
    
    return leaderboard_data


@router.post("/check-streak")
def check_and_update_streak(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="عفواً، تسجيل الحضور (الستريك) متاح للطلاب فقط!"
        )
        
    result = calculate_and_update_streak(db=db, student_id=current_user.id)
    return result