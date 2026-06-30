from dotenv import load_dotenv
load_dotenv(override=True)

import requests
import json

# اللينك بتاع الـ API (هنفترض إننا بنجرب على درس رقم 1)
url = "http://localhost:8000/api/courses/lessons/1/chat"

# السؤال اللي هتبعته للمدرس
payload = {
    "content": "عاوزك تشرحلى ايه هو حاصل الضرب الديكارتى"
}

# ⚠️ تنبيه: لو زميلك قافل الـ API بـ Authentication، هتحتاج تحط التوكين هنا
headers = {
    "Content-Type": "application/json",
    # "Authorization": "Bearer YOUR_TEST_TOKEN_HERE" 
}

print("جاري إرسال السؤال للمدرس...\n")
print("-" * 50)
print("[المدرس الذكي]: ", end="", flush=True)

# بنعمل الـ Request ونقوله stream=True عشان يقرأ الداتا وهي بتتبعت
try:
    with requests.post(url, json=payload, headers=headers, stream=True) as response:
        # لو الـ Status مش 200، هيطبع الـ Error
        response.raise_for_status() 
        
        # بنلف على الـ Stream سطر بسطر
        for line in response.iter_lines():
            if line:
                decoded_line = line.decode('utf-8')
                # لو السطر بيبدأ بـ data: بنشيلها ونطبع الحرف
                if decoded_line.startswith("data: "):
                    chunk = decoded_line.replace("data: ", "")
                    if chunk != "[DONE]":
                        print(chunk, end="", flush=True)
                        
    print("\n" + "-" * 50)
    print("\n[تم الانتهاء من الرد السقراطي بنجاح!]")

except Exception as e:
    print(f"\n حصلت مشكلة: {e}")