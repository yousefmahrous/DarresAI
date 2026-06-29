from llama_index.core import VectorStoreIndex
from llama_index.core.vector_stores.types import MetadataFilter, MetadataFilters, FilterOperator
from llama_index.vector_stores.qdrant import QdrantVectorStore
from llama_index.core import Settings
from llama_index.embeddings.openai import OpenAIEmbedding
from qdrant_client import QdrantClient

# 1. إعداد الـ Embedding Model (لازم يكون نفس الموديل اللي استخدمناه في الـ Ingestion)
Settings.embed_model = OpenAIEmbedding(model="text-embedding-3-small")

def retrieve_curriculum_context(query: str, grade: str, subject: str, language: str) -> str:
    """
    دالة للبحث عن إجابة سؤال الطالب داخل المنهج المخصص له فقط.
    """
    
    # 2. الاتصال بقاعدة البيانات Qdrant
    client = QdrantClient(path="./qdrant_data")
    vector_store = QdrantVectorStore(client=client, collection_name="darresai_curriculum")
    
    # تحميل الـ Index من قاعدة البيانات بدون الحاجة لعمل Ingestion من أول وجديد
    index = VectorStoreIndex.from_vector_store(vector_store=vector_store)

    # 3. بناء فلاتر البحث الصارمة (Strict Metadata Filtering)
    # الفلاتر دي بتشتغل على مستوى الـ DB قبل ما يتم حساب المسافات بين المتجهات
    filters = MetadataFilters(
        filters=[
            MetadataFilter(key="grade", operator=FilterOperator.EQ, value=grade),
            MetadataFilter(key="subject", operator=FilterOperator.EQ, value=subject),
            MetadataFilter(key="language", operator=FilterOperator.EQ, value=language),
        ]
    )

    # 4. إعداد محرك البحث (Retriever)
    retriever = index.as_retriever(
        similarity_top_k=3,  # بنرجع أفضل 3 فقرات من الكتاب لضمان شمولية الإجابة
        filters=filters
    )

    # 5. تنفيذ البحث بالسؤال بتاع الطالب
    print(f"Retrieving context for query: '{query}' | Filters: {grade}, {subject}, {language}")
    nodes = retriever.retrieve(query)
    
    # 6. تجميع النصوص المستخرجة في نص واحد جاهز يتبعت للـ LLM
    if not nodes:
        return "لم يتم العثور على معلومات متعلقة بهذا السؤال في المنهج الدراسي."
        
    context_str = "\n\n---\n\n".join([n.get_content() for n in nodes])
    
    return context_str

# ==========================================
# تجربة السكريبت للـ Debugging
# ==========================================
if __name__ == "__main__":
    # نفترض إن الطالب في أولى ثانوي عربي سأل السؤال ده:
    test_query = "إيه هو قانون نيوتن الثاني وممكن تديني مثال عليه؟"
    
    context = retrieve_curriculum_context(
        query=test_query,
        grade="sec_1",
        subject="physics",
        language="ar"
    )
    
    print("\n[الـ Context المستخرج من كتاب الوزارة]:\n")
    print(context)