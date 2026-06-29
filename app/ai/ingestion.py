import os
from llama_index.core import Document, VectorStoreIndex, StorageContext, Settings
from llama_index.core.node_parser import SentenceSplitter
from llama_index.readers.file import PyMuPDFReader
from llama_index.vector_stores.qdrant import QdrantVectorStore
from qdrant_client import QdrantClient

# 1. إعداد الـ Embedding Model
# يفضل استخدام موديل قوي في اللغات زي OpenAI text-embedding-3-small أو Cohere Multilingual
# هنا بنفترض إنك عامل set للـ API Key في الـ .env
from llama_index.embeddings.openai import OpenAIEmbedding
Settings.embed_model = OpenAIEmbedding(model="text-embedding-3-small")

# 2. إعداد قاعدة بيانات المتجهات (Qdrant)
# هنستخدم Local Path دلوقتي للـ MVP عشان السرعة والتجربة، وبعدين ننقله لـ Cloud
client = QdrantClient(path="./qdrant_data")
vector_store = QdrantVectorStore(client=client, collection_name="darresai_curriculum")
storage_context = StorageContext.from_defaults(vector_store=vector_store)

def ingest_educational_material(file_path: str, grade: str, subject: str, language: str):
    """
    دالة لتحويل ملفات المنهج إلى Chunks ذكية وتخزينها في Qdrant.
    """
    print(f"Start processing: {file_path}")
    
    # 3. قراءة الملف (استخدمنا PyMuPDF لأنه الأقوى في دعم العربي والـ RTL والرياضيات)
    loader = PyMuPDFReader()
    docs = loader.load(file_path=file_path)
    
    # 4. حقن الـ Metadata الصارمة لكل صفحة
    for doc in docs:
        doc.metadata = {
            "grade": grade,          # مثال: "sec_1"
            "subject": subject,      # مثال: "physics" أو "history"
            "language": language,    # مثال: "ar" أو "en"
            "file_name": os.path.basename(file_path)
        }
        # بنمنع الـ LLM إنه يشوف اسم الملف عشان ميتشتتش، الـ Metadata دي للفلترة بس
        doc.excluded_llm_metadata_keys = ["file_name"]

    # 5. التقطيع الذكي (Semantic & Sentence Chunking)
    # هنقطع الداتا لـ بلوكات، كل بلوك 512 توكين، مع تداخل 50 توكين عشان مفيش معلومة تضيع في النص
    node_parser = SentenceSplitter(chunk_size=512, chunk_overlap=50)
    nodes = node_parser.get_nodes_from_documents(docs)
    print(f"Created {len(nodes)} chunks from the document.")

    # 6. البناء والتخزين في الـ Vector DB
    # الخطوة دي هتعمل Embedding لكل البلوكات وتبعتها لـ Qdrant
    index = VectorStoreIndex(
        nodes,
        storage_context=storage_context,
        show_progress=True
    )
    
    print("Ingestion completed successfully! Data is ready for retrieval.")
    return index

# ==========================================
# مثال لتشغيل السكريبت (تقدر تجربه كسكريبت منفصل دلوقتي)
# ==========================================
if __name__ == "__main__":
    # مثال 1: كتاب فيزياء أولى ثانوي عربي
    # ingest_educational_material("books/physics_sec1_ar.pdf", "sec_1", "physics", "ar")
    
    # مثال 2: كتاب تاريخ أولى ثانوي إنجليزي (مدارس لغات)
    # ingest_educational_material("books/history_sec1_en.pdf", "sec_1", "history", "en")
    pass