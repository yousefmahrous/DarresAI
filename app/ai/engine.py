from app.ai.retriever import retrieve_curriculum_context
from app.ai.generator import generate_socratic_stream

def generate_ai_tutor_response(query: str, grade: str, subject: str, language: str, chat_history: list):
    """
    الدالة الرئيسية اللي الـ Backend هيناديها.
    بتاخد بيانات الطالب والسؤال، وتنفذ الـ RAG، وترجع Stream للرد.
    """
    print(f"[Engine] Starting RAG Pipeline for query: {query}")
    
    # 1. البحث في كتاب الوزارة (Qdrant) بناءً على صف الطالب ومادته
    context_str = retrieve_curriculum_context(
        query=query,
        grade=grade,
        subject=subject,
        language=language
    )
    
    # 2. توليد الرد السقراطي (Stream) من Claude 3.5 Sonnet
    # بنباصي الـ History عشان الموديل يكون فاهم السياق القديم
    response_stream = generate_socratic_stream(
        query=query,
        context_str=context_str,
        chat_history=chat_history
    )
    
    return response_stream