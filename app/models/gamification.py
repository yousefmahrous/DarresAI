from sqlalchemy import Column, Integer, ForeignKey, Date
from sqlalchemy.orm import relationship
from datetime import date
from app.database import Base

class Gamification(Base):
    __tablename__ = "gamification"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    points = Column(Integer, default=0)
    streak = Column(Integer, default=0)
    last_active_date = Column(Date, nullable=True)
    student = relationship("User", backref="gamification", overlaps="streak_info")