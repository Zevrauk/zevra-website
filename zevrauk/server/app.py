"""
Zevrauk website server.
 - serves the static site from ../public
 - POST /api/contact : emails contact-form requests to OWNER_EMAIL
Run locally:  python3 app.py
Live server:  gunicorn -w 1 --threads 8 -b 0.0.0.0:$PORT app:app
"""
import os, time, smtplib
from collections import defaultdict, deque
from email.message import EmailMessage
from flask import Flask, request, jsonify
from dotenv import load_dotenv

BASE = os.path.dirname(os.path.abspath(__file__))
PUBLIC = os.path.abspath(os.path.join(BASE, "..", "public"))
load_dotenv(os.path.join(BASE, ".env"))

OWNER = os.getenv("OWNER_EMAIL", "info@zevrauk.com")
SMTP_HOST = os.getenv("SMTP_HOST", "")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASS = os.getenv("SMTP_PASS", "")
MAIL_FROM = os.getenv("MAIL_FROM", SMTP_USER or OWNER)

app = Flask(__name__, static_folder=PUBLIC, static_url_path="")
HITS = defaultdict(deque)

def ip():
    return (request.headers.get("X-Forwarded-For", request.remote_addr or "?").split(",")[0]).strip()

def limited(kind, n, window):
    key, now = (kind, ip()), time.time()
    q = HITS[key]
    while q and now - q[0] > window:
        q.popleft()
    if len(q) >= n:
        return True
    q.append(now)
    return False

def one_line(s, n=100):
    return " ".join(str(s).split())[:n]

def send_mail(subject, body, reply_to=None):
    if not SMTP_HOST:
        app.logger.error("SMTP not configured; email not sent: %s", subject)
        return False
    msg = EmailMessage()
    msg["Subject"], msg["From"], msg["To"] = one_line(subject, 150), MAIL_FROM, OWNER
    if reply_to:
        msg["Reply-To"] = reply_to
    msg.set_content(body)
    try:
        if SMTP_PORT == 465:
            with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, timeout=20) as s:
                s.login(SMTP_USER, SMTP_PASS); s.send_message(msg)
        else:
            with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=20) as s:
                s.starttls(); s.login(SMTP_USER, SMTP_PASS); s.send_message(msg)
        return True
    except Exception:
        app.logger.exception("Email failed")
        return False

@app.get("/")
def home():
    return app.send_static_file("index.html")

@app.post("/api/contact")
def contact():
    d = request.get_json(silent=True, force=True) or {}
    if d.get("website"):                      # honeypot: bots fill this
        return jsonify(ok=True)
    if limited("contact", 5, 3600):
        return jsonify(error="Too many requests. Please try again later."), 429
    name, email = one_line(d.get("name", "")), one_line(d.get("email", ""), 150)
    phone, text = one_line(d.get("phone", ""), 40), str(d.get("message", "")).strip()[:3000]
    if not name or "@" not in email or "." not in email or not text:
        return jsonify(error="Please fill in your name, a valid email and your message."), 400
    ok = send_mail(f"New order request from {name}",
                   f"Name: {name}\nEmail: {email}\nPhone: {phone or chr(45)}\n\nMessage:\n{text}\n", reply_to=email)
    if not ok:
        return jsonify(error="We could not send your request. Please email info@zevrauk.com."), 502
    return jsonify(ok=True)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "8000")))
