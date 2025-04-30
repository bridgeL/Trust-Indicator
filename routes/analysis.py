from io import BytesIO
from flask import Blueprint, Flask, render_template, send_file, session
from database import Image

bp = Blueprint("analysis", __name__)


@bp.route("/analysis")
def analysis():
    return render_template("html/analysis.html")


@bp.route("/getImage")
def get_image_for_analysis():
    # Get the image id from the user session
    image_id = session.get("image_id_for_analysis")

    if image_id:
        image = Image.query.get(image_id)
        if image and image.data:
            return send_file(
                BytesIO(image.data), download_name=image.filename, mimetype="image/jpeg"
            )  # Or the correct MIME type for the image
        else:
            return "Image not found", 404
    else:
        return "No image ID provided", 400


def init(app: Flask):
    app.register_blueprint(bp)
