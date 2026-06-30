from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import json # ضفنا المكتبة دي عشان نحول الداتا لـ JSON في الـ Stream

from app.database import get_db
from app.routers.auth import get_current_user
from app.models.users import User
from app.models.courses import Course, Lesson, LessonChatMessage, CourseEnrollment 

from app.schemas.courses import (
    CourseCreate, CourseResponse, LessonCreate, 
    LessonResponse, ChatMessageCreate, ChatMessageResponse
)

from fastapi.responses import StreamingResponse
from fastapi import BackgroundTasks
from app.ai.engine import generate_ai_tutor_response

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
        school_year=course.school_year,
        language=course.language
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

@router.post("/lessons/{lesson_id}/chat")
def send_lesson_chat_message(
    lesson_id: int, 
    chat_input: ChatMessageCreate, 
    background_tasks: BackgroundTasks, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    # 1. تفعيل فحص الداتا بيز للدرس والكورس (الصح بقى)
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="الدرس غير موجود.")
    
    course = db.query(Course).filter(Course.id == lesson.course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="الكورس المرتبط بهذا الدرس غير موجود.")
    
    # ملحوظة: لو الـ Course Model لسه مفيهوش أعمدة subject و language، 
    # استخدمنا getattr عشان نجيبهم ولو مش موجودين نحط قيم افتراضية عشان الكود ميضربش
    course_language = getattr(course, "language", "Arabic")
    course_title = course.title
    
    # 2. تفعيل حفظ سؤال الطالب في الداتا بيز
    user_msg = LessonChatMessage(
        user_id=current_user.id, 
        lesson_id=lesson_id, 
        sender="user", 
        content=chat_input.content, 
        message_type="text"
    )
    db.add(user_msg)
    db.commit()

    # 3. جلب تاريخ المحادثة الحقيقي من الداتا بيز
    chat_history = db.query(LessonChatMessage).filter(
        LessonChatMessage.user_id == current_user.id,
        LessonChatMessage.lesson_id == lesson_id
    ).order_by(LessonChatMessage.created_at.asc()).all()

    # 4. دالة الـ Streaming اللي بتبعت JSON للسبورة والشات
    def ai_response_generator():
        stream = generate_ai_tutor_response(
            query=chat_input.content,
            grade=current_user.school_year,
            subject=course_title, 
            language=course_language,
            chat_history=chat_history
        )
        
        full_ai_response = ""
        for chunk in stream:
            # بنجمع النص لو الحدث كان "message" عشان نحفظه في الداتا بيز
            if chunk.get("event") == "message" and chunk.get("data"):
                full_ai_response += str(chunk["data"])
                
            # تحويل الـ Chunk لـ JSON String وبعته في الـ Stream
            yield f"data: {json.dumps(chunk)}\n\n"
            
        yield "data: [DONE]\n\n"
        
        # 5. تفعيل حفظ رد الـ AI في الخلفية بعد ما الـ Stream يخلص
        background_tasks.add_task(save_ai_message_to_db, current_user.id, lesson_id, full_ai_response, db)

    return StreamingResponse(ai_response_generator(), media_type="text/event-stream")

def save_ai_message_to_db(user_id: int, lesson_id: int, content: str, db: Session):
    ai_msg = LessonChatMessage(
        user_id=user_id, 
        lesson_id=lesson_id, 
        sender="ai", 
        content=content, 
        message_type="text"
    )
    db.add(ai_msg)
    db.commit()