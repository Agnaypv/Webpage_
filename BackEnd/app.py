from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app)

# ✅ allow up to 16 MB uploads (IMPORTANT for Render)
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024

# ✅ absolute paths (Render-safe)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DB_PATH = os.path.join(BASE_DIR, "database.db")

UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


# ---------------- LOGIN ----------------
@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    con = sqlite3.connect(DB_PATH)
    cur = con.cursor()
    cur.execute(
        "SELECT role FROM users WHERE username=? AND password=?",
        (username, password),
    )
    result = cur.fetchone()
    con.close()

    if result:
        return jsonify({"success": True, "role": result[0]})
    else:
        return jsonify({"success": False})


# ---------------- GET NOTES ----------------
@app.route("/api/notes", methods=["GET"])
def get_notes():
    con = sqlite3.connect(DB_PATH)
    cur = con.cursor()
    cur.execute("SELECT id,title,subject,filename FROM notes")
    rows = cur.fetchall()
    con.close()

    notes = [
        {
            "id": r[0],
            "title": r[1],
            "subject": r[2],
            "filename": r[3],
        }
        for r in rows
    ]

    return jsonify(notes)


# ---------------- UPLOAD NOTE ----------------
@app.route("/api/upload", methods=["POST"])
def upload():
    try:
        print("UPLOAD HIT")

        title = request.form.get("title")
        subject = request.form.get("subject")

        # ✅ robust file validation
        if "file" not in request.files:
            print("No file part")
            return jsonify({"success": False, "error": "No file part"})

        file = request.files["file"]

        if file.filename == "":
            print("Empty filename")
            return jsonify({"success": False, "error": "Empty filename"})

        filepath = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
        print("Saving to:", filepath)

        file.save(filepath)

        con = sqlite3.connect(DB_PATH)
        cur = con.cursor()
        cur.execute(
            "INSERT INTO notes (title, subject, filename) VALUES (?,?,?)",
            (title, subject, file.filename),
        )
        con.commit()
        con.close()

        return jsonify({"success": True})

    except Exception as e:
        print("UPLOAD ERROR:", str(e))
        return jsonify({"success": False, "error": str(e)})


# ---------------- DOWNLOAD ----------------
@app.route("/api/download/<filename>")
def download(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)


# ---------------- DELETE NOTE ----------------
@app.route("/api/delete/<int:note_id>", methods=["DELETE"])
def delete_note(note_id):
    con = sqlite3.connect(DB_PATH)
    cur = con.cursor()

    cur.execute("SELECT filename FROM notes WHERE id=?", (note_id,))
    row = cur.fetchone()

    if not row:
        con.close()
        return jsonify({"success": False})

    filename = row[0]

    file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    if os.path.exists(file_path):
        os.remove(file_path)

    cur.execute("DELETE FROM notes WHERE id=?", (note_id,))
    con.commit()
    con.close()

    return jsonify({"success": True})


# ✅ Render-safe run
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)