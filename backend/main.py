from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, text
from sqlalchemy.engine import URL
import bcrypt #for password encryption

app = FastAPI()

# Allow the React dev server to call FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DB connection (add this) ---
DATABASE_URL = URL.create(
    "mysql+pymysql",
    username="root",
    password="aidan-2003",   # <-- put your real password here
    host="127.0.0.1",
    port=3306,
    database="speedCoder",
    query={"charset": "utf8mb4"},
)

ENGINE = create_engine(
    DATABASE_URL, 
    pool_pre_ping=True, 
    echo=True, 
    future=True)
# --- end DB connection ---

# getting a random code snippet from the database
@app.get("/snippets/random")
def random_snippet():
    sql = text("""
        SELECT id, language, snippet
        FROM codeSnippets
        WHERE isActive = 1
        ORDER BY RAND()
        LIMIT 1
    """)
    with ENGINE.connect() as conn:
        row = conn.execute(sql).mappings().first()
    if not row:
        raise HTTPException(status_code=404, detail="No active snippet found")
    return {"id": row["id"], "language": row["language"], "snippet": row["snippet"]}







@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI is working!"}