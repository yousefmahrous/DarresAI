from dotenv import load_dotenv
load_dotenv(override=True)

import os
import json
from openai import OpenAI
from app.ai.prompts import SOCRATIC_TUTOR_PROMPT

# إعداد الـ LLM باستخدام OpenAI Client المباشر للتحكم الكامل في الـ Stream
client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY")
)

def generate_socratic_stream(query: str, context_str: str, chat_history: list):
    """
    دالة بتاخد السؤال، السياق، والهيستوري، وبترجع Stream للرد السقراطي أو أوامر السبورة التفاعلية.
    """
    
    # 1. تجهيز رسالة الـ System بعد حقن الـ Context فيها
    formatted_system_prompt = SOCRATIC_TUTOR_PROMPT.format(context_str=context_str)
    
    messages = [
        {"role": "system", "content": formatted_system_prompt}
    ]
    
    # 2. دمج الهيستوري بتاع المحادثة (آخر 5 رسائل لتوفير التوكينز)
    for msg in chat_history[-5:]:
        # الداتا بيز بتسجل "ai"، بس الموديل محتاج كلمة "assistant"
        role = "assistant" if msg.sender == "ai" else "user"
        messages.append({"role": role, "content": msg.content})
        
    # 3. إضافة سؤال الطالب الحالي
    messages.append({"role": "user", "content": query})
    
    # 4. تعريف أداة السبورة (Tool Definition)
    tools = [
        {
            "type": "function",
            "function": {
                "name": "update_board",
                "description": "استخدم هذه الأداة لعرض المعادلات الرياضية المعقدة، أو الصور التوضيحية على السبورة التفاعلية للطالب.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "type": {
                            "type": "string",
                            "enum": ["formula", "image", "widget"],
                            "description": "نوع المحتوى: formula للمعادلة، image للصورة."
                        },
                        "payload": {
                            "type": "string",
                            "description": "المحتوى نفسه: كود LaTeX للمعادلة (بدون علامات الدولار)، أو رابط الصورة."
                        }
                    },
                    "required": ["type", "payload"]
                }
            }
        }
    ]

    # 5. طلب الرد في شكل Stream
    print("[Engine] Generating Socratic Response with Tool Calling (Streaming)...")
    response = client.chat.completions.create(
        model="gpt-4o", # 🚀 التعديل هنا: استخدمنا الموديل الأقوى والأذكى
        messages=messages,
        tools=tools,
        stream=True
    )

    tool_call_args = ""
    current_tool_name = None

    # 6. معالجة الـ Stream في الوقت الفعلي
    for chunk in response:
        # التأكد إن الـ chunk مش فاضي
        if not chunk.choices:
            continue
            
        delta = chunk.choices[0].delta

        # الحالة الأولى: الذكاء الاصطناعي بيشرح بالكلام العادي
        if delta.content:
            yield {"event": "message", "data": delta.content}

        # الحالة الثانية: الذكاء الاصطناعي قرر يستخدم السبورة وبدأ يبعت Tool Call
        if delta.tool_calls:
            tool_call = delta.tool_calls[0]
            
            if tool_call.function.name:
                current_tool_name = tool_call.function.name
                
            if tool_call.function.arguments:
                tool_call_args += tool_call.function.arguments

        # الحالة الثالثة: الـ Chunk خلص، نتأكد إذا كان الـ Tool Call اكتمل نبعته
        if chunk.choices[0].finish_reason == "tool_calls":
            if current_tool_name == "update_board":
                try:
                    args = json.loads(tool_call_args)
                    yield {
                        "event": "board_update",
                        "data": {
                            "type": args.get("type"),
                            "payload": args.get("payload")
                        }
                    }
                except Exception as e:
                    print(f"[Error] Failed to parse tool call arguments: {e}")
                finally:
                    tool_call_args = ""
                    current_tool_name = None

# ==========================================
# تجربة السكريبت للـ Debugging
# ==========================================
if __name__ == "__main__":
    import asyncio
    
    # Mock class عشان نعمل Test سريع للهيستوري
    class MockMessage:
        def __init__(self, sender, content):
            self.sender = sender
            self.content = content

    sample_context = "قانون الجاذبية العام لنيوتن ينص على أن قوة التجاذب تتناسب طرديا مع حاصل ضرب الكتلتين وعكسيا مع مربع المسافة بينهما."
    sample_query = "ممكن تكتبلي قانون الجاذبية العام على السبورة عشان أنقله؟"
    empty_history = [MockMessage("ai", "أهلاً بيك يا بطل! جاهز نبدأ؟")]
    
    stream = generate_socratic_stream(sample_query, sample_context, empty_history)
    
    print("\n[Stream Output]:\n")
    for chunk in stream:
        print(chunk)