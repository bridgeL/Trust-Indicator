from datetime import timedelta
from flask import Flask, session
from flask_session import Session


def init(app: Flask):
    app.config["SESSION_PERMANENT"] = False
    app.config["SESSION_TYPE"] = "filesystem"
    app.config["SESSION_FILE_DIR"] = "./flask_session_cache"
    app.secret_key = "COMP8715"
    Session(app)

    app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(minutes=0)

    @app.before_request
    def make_session_not_permanent():
        session.permanent = False
