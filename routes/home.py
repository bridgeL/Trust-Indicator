from flask import Blueprint, Flask, render_template

bp = Blueprint("home", __name__)


@bp.route("/")
def index():
    return render_template("html/index.html")


def init(app: Flask):
    app.register_blueprint(bp)
