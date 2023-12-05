from pathlib import Path
import sqlite3

PATH_TO_DB = Path("db.sqlite3")

def get_db_connection():
  return sqlite3.connect(PATH_TO_DB)