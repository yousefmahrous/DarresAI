from pydantic import BaseModel
from typing import Optional, Literal, Union, Dict, Any

# 1. الموديل الخاص بحالة السبورة
class BoardState(BaseModel):
    # نوع المحتوى اللي هيتعرض على السبورة
    type: Literal["formula", "image", "widget"]
    # المحتوى نفسه (ممكن يكون معادلة LaTeX، أو لينك صورة، أو إعدادات Widget)
    payload: Union[str, Dict[str, Any]]

# 2. الموديل الخاص بالـ Chunk اللي بيتبعت في الـ Stream
class ChatStreamChunk(BaseModel):
    # نوع الحدث: يا إما نص جديد للشات، يا إما تحديث للسبورة، يا إما خلصنا
    event: Literal["message", "board_update", "done"]
    # الداتا اللي راجعة بناءً على الحدث
    data: Union[str, BoardState, None]

# 3. الموديل الخاص باستقبال الرسالة من الفرانتد
class ChatRequest(BaseModel):
    message: str
    lesson_id: int