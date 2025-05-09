from io import BytesIO
from flask import Blueprint, Flask, render_template, send_file, session
from database import Image

bp = Blueprint("analysis", __name__)


@bp.route("/analysis")
def analysis():
    return render_template("html/analysis.html")


@bp.route("/getImage")
def get_image_for_analysis():
    image_id = session.get("image_id_for_analysis")
    if not image_id:
        return "No image ID provided", 400

    image = Image.query.get(image_id)
    if not image or not image.data:
        return "Image not found", 404

    return send_file(
        BytesIO(image.data), download_name=image.filename, mimetype="image/jpeg"
    )


def init(app: Flask):
    app.register_blueprint(bp)
