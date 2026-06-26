from sqlalchemy.orm import Session
from datetime import date, timedelta
from app.models.gamification import Gamification

def calculate_and_update_streak(db: Session, student_id: int):
    today = date.today()
    user_game = db.query(Gamification).filter(Gamification.student_id == student_id).first()
    
    if not user_game:
        user_game = Gamification(student_id=student_id, streak=1, last_active_date=today)
        db.add(user_game)
        db.commit()
        return {"streak": 1, "points": 0, "message": "أول يوم ليك النهاردة! بداية رحلة الالتزام"}

    if user_game.last_active_date == today:
        return {"streak": user_game.streak, "points": user_game.points, "message": "أنت حافظت على الـ Streak بتاعك النهاردة بالفعل!"}
    
    elif user_game.last_active_date == today - timedelta(days=1):
        user_game.streak += 1
        user_game.points += 5 
    
    else:
        user_game.streak = 1

    user_game.last_active_date = today
    db.commit()
    db.refresh(user_game)
    
    return {
        "streak": user_game.streak,
        "points": user_game.points,
        "message": f"عاش! الـ Streak بتاعك بقا {user_game.streak} يوم متتالي وجمعت 5 نقط بونص"
    }