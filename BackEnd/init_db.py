import sqlite3

con = sqlite3.connect("database.db")
cur = con.cursor()

cur.execute("""
CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT,
    role TEXT
)
""")

cur.execute("""
CREATE TABLE IF NOT EXISTS notes(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    subject TEXT,
    filename TEXT
)
""")

# default accounts
cur.execute("INSERT INTO users VALUES (NULL,'teacher','123','teacher')")
cur.execute("INSERT INTO users VALUES (NULL,'student','123','student')")

con.commit()
con.close()