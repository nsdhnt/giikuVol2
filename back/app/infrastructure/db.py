from contextlib import contextmanager
from psycopg2 import pool
import os

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set")

connection_pool = pool.SimpleConnectionPool(1, 10, DATABASE_URL)

def get_db():
    conn = connection_pool.getconn()
    try:
        yield conn
        conn.commit()
    except:
        conn.rollback()
        raise
    finally:
        connection_pool.putconn(conn)