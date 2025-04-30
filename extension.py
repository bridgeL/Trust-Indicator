import os
from dotenv import load_dotenv
from datetime import timedelta
from flask import Flask, session
from flask_mail import Mail, Message
from flask_login import LoginManager
from flask_session import Session
from database import User

login_manager = LoginManager()
mail = Mail()

load_dotenv()
mail_username = os.environ.get("MAIL_USERNAME")
mail_password = os.environ.get("MAIL_PASSWORD")


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


def init(app: Flask):
    login_manager.init_app(app)

    # Email Server
    app.config["MAIL_SERVER"] = "smtp.gmail.com"
    app.config["MAIL_PORT"] = 587
    app.config["MAIL_USERNAME"] = mail_username
    app.config["MAIL_PASSWORD"] = mail_password
    app.config["MAIL_USE_TLS"] = True
    app.config["MAIL_USE_SSL"] = False

    mail.init_app(app)

    # session
    app.config["SESSION_PERMANENT"] = False
    app.config["SESSION_TYPE"] = "filesystem"
    app.config["SESSION_FILE_DIR"] = "./flask_session_cache"
    app.secret_key = "COMP8715"
    Session(app)

    app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(minutes=0)

    @app.before_request
    def make_session_not_permanent():
        session.permanent = False


def send_email(subject, recipient, body, html):
    msg = Message(subject=subject, sender=mail_username, recipients=[recipient])
    msg.body = body
    msg.html = html
    mail.send(msg)


def print_all_endpoints(app: Flask):
    for rule in app.url_map.iter_rules():
        print(f"Endpoint: {rule.endpoint}")
        print(f"URL: {rule.rule}")
        print(f"Methods: {', '.join(rule.methods)}")
        print("------")
