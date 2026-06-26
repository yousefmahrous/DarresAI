from sqlalchemy import Column, Integer, ForeignKey, String
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False)
    streak_info = relationship("Gamification", uselist=False, back_populates="student")

class StudentParentRelation(Base):
    __tablename__ = "student_parent_relations"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    parent_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    link_code = Column(String, unique=True, nullable=False)