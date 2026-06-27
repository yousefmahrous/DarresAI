from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.routers.auth import get_current_user
from app.models.users import User
from app.models.courses import Course, Lesson, LessonChatMessage, CourseEnrollment 

from app.schemas.courses import (
    CourseCreate, CourseResponse, LessonCreate, 
    LessonResponse, ChatMessageCreate, ChatMessageResponse
)

router = APIRouter()

@router.post("/", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
def create_course(course: CourseCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="غير مسموح لك بالوصول! هذه الصلاحية خاصة بالأدمن فقط."
        )
        
    new_course = Course(
        title=course.title, 
        description=course.description,
        school_year=course.school_year
    )
    db.add(new_course)
    db.commit()
    db.refresh(new_course)
    return new_course


@router.get("/", response_model=List[CourseResponse])
def get_my_courses(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    
    if current_user.role == "admin":
        return db.query(Course).all()
    
    if current_user.role == "student":
        return db.query(Course).join(CourseEnrollment).filter(CourseEnrollment.student_id == current_user.id).all()
    
    return []


@router.get("/available", response_model=List[CourseResponse])
def get_available_courses(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "student":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="هذه الدالة مخصصة للطلاب فقط للاشتراك في الكورسات الجديدة."
        )
        
    enrolled_course_ids = db.query(CourseEnrollment.course_id).filter(CourseEnrollment.student_id == current_user.id).subquery()
    
    return db.query(Course).filter(
        Course.school_year == current_user.school_year,
        Course.id.not_in(enrolled_course_ids)
    ).all()


@router.post("/{course_id}/enroll", status_code=status.HTTP_201_CREATED)
def enroll_in_course(course_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="الطلاب فقط هم من يمكنهم الاشتراك في الكورسات الدراسية.")

    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="الكورس المراد الاشتراك فيه غير موجود.")

    if str(course.school_year).strip() != str(current_user.school_year).strip():
        raise HTTPException(status_code=400, detail="عذراً، هذا الكورس غير مخصص لسنتك الدراسية الحالية.")

    already_enrolled = db.query(CourseEnrollment).filter(
        CourseEnrollment.student_id == current_user.id,
        CourseEnrollment.course_id == course_id
    ).first()
    if already_enrolled:
        raise HTTPException(status_code=400, detail="أنت مشترك بالفعل في هذا الكورس مسبقاً.")

    new_enrollment = CourseEnrollment(student_id=current_user.id, course_id=course_id)
    db.add(new_enrollment)
    db.commit()

    return {"status": "success", "message": f"تم الاشتراك بنجاح في كورس: {course.title}"}


@router.put("/{course_id}", response_model=CourseResponse)
def update_course(course_id: int, course_update: CourseCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="هذه الصلاحية خاصة بالأدمن فقط.")

    db_course = db.query(Course).filter(Course.id == course_id).first()
    if not db_course:
        raise HTTPException(status_code=404, detail="الكورس ده مش موجود!")

    db_course.title = course_update.title
    db_course.description = course_update.description
    db_course.school_year = course_update.school_year

    db.commit()
    db.refresh(db_course)
    return db_course


@router.delete("/{course_id}", status_code=status.HTTP_200_OK)
def delete_course(course_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="هذه الصلاحية خاصة بالأدمن فقط.")

    db_course = db.query(Course).filter(Course.id == course_id).first()
    if not db_course:
        raise HTTPException(status_code=404, detail="الكورس ده مش موجود!")

    db.delete(db_course)
    db.commit()
    return {"message": "تم حذف الكورس بنجاح وكل الدروس المتعلقة به!"}


@router.post("/{course_id}/lessons", response_model=LessonResponse, status_code=status.HTTP_201_CREATED)
def create_lesson(course_id: int, lesson: LessonCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="هذه الصلاحية خاصة بالأدمن فقط.")

    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="الكورس ده مش موجود!")
    
    new_lesson = Lesson(
        title=lesson.title, 
        content=lesson.content, 
        order=lesson.order, 
        course_id=course_id
    )
    db.add(new_lesson)
    db.commit()
    db.refresh(new_lesson)
    return new_lesson


@router.get("/lessons/{lesson_id}/chat", response_model=List[ChatMessageResponse])
def get_lesson_chat_history(lesson_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    messages = db.query(LessonChatMessage).filter(
        LessonChatMessage.user_id == current_user.id,
        LessonChatMessage.lesson_id == lesson_id
    ).order_by(LessonChatMessage.created_at.asc()).all()
    return messages


@router.post("/lessons/{lesson_id}/chat", response_model=ChatMessageResponse)
def send_lesson_chat_message(lesson_id: int, chat_input: ChatMessageCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    
    user_msg = LessonChatMessage(
        user_id=current_user.id, 
        lesson_id=lesson_id, 
        sender="user", 
        content=chat_input.content, 
        message_type="text"
    )
    db.add(user_msg)
    db.commit()

    # ========================================================
    # ⚠️ تنبيه يا عبدالله ليك ولـ مهندس الـ AI: 
    # حط الدالة (Function) الخاصة بـ الـ AI هنا مستقبلاً.
    # الفانكشن هتاخد سؤال الطالب (chat_input.content)، وتاريخ الشات القديم من فوق لو محتاجه،
    # وتعمل بحث في الـ Vector DB، وترجع الرد والنوع ونحطه مكان السطور دي:
    # ========================================================
    ai_reply_content = "رد مبدئي: سيب مكانك هنا لمهندس الـ AI يربط الموديل بتاعه ويبحث في الـ Vector DB."
    ai_reply_type = "text" 
    # ========================================================

    ai_msg = LessonChatMessage(
        user_id=current_user.id, 
        lesson_id=lesson_id, 
        sender="ai", 
        content=ai_reply_content, 
        message_type=ai_reply_type
    )
    db.add(ai_msg)
    db.commit()
    db.refresh(ai_msg)

    return ai_msg