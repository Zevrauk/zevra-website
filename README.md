# Zevrauk website
public/  = website pages, css/, js/, images/
server/  = app.py (contact form email), requirements.txt, .env.example

Run: cd server; pip3 install -r requirements.txt; python3 app.py; open http://localhost:8000
Contact form emails need SMTP_* in server/.env (copy .env.example to .env).
