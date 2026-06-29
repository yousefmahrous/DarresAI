from llama_index.llms.anthropic import Anthropic
from llama_index.core.llms import ChatMessage, MessageRole
from llama_index.core import Settings
import os

from app.ai.prompts import SOCRATIC_TUTOR_PROMPT

# 1. إعداد الـ LLM (يفضل Claude 3.5 Sonnet عشان عبقري في الـ Socratic Method)
# تأكد إن الـ API Key موجود في ملف الـ .env
llm = Anthropic(model="claude-3-5-sonnet-20240620", temperature=0.2)
Settings.llm = llm

def generate_socratic_stream(query: str, context_str: str, chat_history: list):
    """
    دالة بتاخد السؤال، السياق، والهيستوري، وبترجع Stream للرد السقراطي.
    """
    
    # 3. تجهيز رسالة الـ System بعد حقن الـ Context فيها
    formatted_system_prompt = SOCRATIC_TUTOR_PROMPT.format(context_str=context_str)
    
    messages = [
        ChatMessage(role=MessageRole.SYSTEM, content=formatted_system_prompt)
    ]
    
    # 4. دمج الهيستوري بتاع المحادثة (عشان الموديل يفتكر هو كان بيكلم الطالب في إيه)
    # بنفترض إن chat_history جاي من الـ Database في شكل list of dicts
    for msg in chat_history[-5:]: # بناخد آخر 5 رسائل بس عشان نوفر الـ Tokens
        role = MessageRole.USER if msg.sender == "user" else MessageRole.ASSISTANT
        messages.append(ChatMessage(role=role, content=msg.content))
        
    # 5. إضافة سؤال الطالب الحالي
    messages.append(ChatMessage(role=MessageRole.USER, content=query))
    
    # 6. طلب الرد في شكل Stream
    print("Generating Socratic Response (Streaming)...")
    response_stream = llm.stream_chat(messages)
    
    return response_stream

# ==========================================
# تجربة السكريبت للـ Debugging
# ==========================================
if __name__ == "__main__":
    # داتا وهمية للتجربة
    sample_context = "قانون نيوتن الثاني ينص على أن القوة المحصلة المؤثرة على جسم تساوي كتلة الجسم مضروبة في عجلته."
    sample_query = "طب لو عربية كتلتها 1000 كجم وبتتحرك بعجلة 2 متر/ثانية تربيع، القوة تبقى كام؟"
    empty_history = []
    
    stream = generate_socratic_stream(sample_query, sample_context, empty_history)
    
    print("\n[رد المدرس]: ", end="")
    for chunk in stream:
        print(chunk.delta, end="", flush=True)
    print("\n")