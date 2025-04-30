from flask import Flask, Blueprint, render_template

bp = Blueprint("whatwedo", __name__)


@bp.route("/whatwedo")
def whatwedo():
    return render_template("html/whatwedo.html")


def init(app: Flask):
    app.register_blueprint(bp)
