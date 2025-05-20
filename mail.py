import os
from flask import Flask
from flask_mail import Mail, Message

mail = Mail()

mail_username = os.environ.get("MAIL_USERNAME")
mail_password = os.environ.get("MAIL_PASSWORD")


def init(app: Flask):

    # Email Server
    app.config["MAIL_SERVER"] = "smtp.gmail.com"
    app.config["MAIL_PORT"] = 587
    app.config["MAIL_USERNAME"] = mail_username
    app.config["MAIL_PASSWORD"] = mail_password
    app.config["MAIL_USE_TLS"] = True
    app.config["MAIL_USE_SSL"] = False

    mail.init_app(app)


def send_email(subject, recipient, body, html):
    msg = Message(subject=subject, sender=mail_username, recipients=[recipient])
    msg.body = body
    msg.html = html
    mail.send(msg)
