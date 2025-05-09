import os
import random
from io import BytesIO

from flask import Blueprint, Flask, render_template, send_file, jsonify, request
from flask_login import current_user

from database import Image

bp = Blueprint("gallery", __name__)


@bp.route("/gallery")
def GotoGallery():
    sort_order = request.args.get("sort", "desc")
    user_email = current_user.UserName if current_user.is_authenticated else "Welcome"

    return render_template("html/gallery.html", user_email=user_email, sort=sort_order)


@bp.route("/image/<int:image_id>")
def get_image(image_id):
    image = Image.query.get(image_id)
    if image and image.data:
        return send_file(
            BytesIO(image.data),
            mimetype="image/jpeg",  # or 'image/png' etc depending on your image type
            as_attachment=True,
            download_name=image.filename,
        )
    else:
        os.abort(404)


@bp.route("/getimages")
def get_images():
    images = Image.query.all()
    image_info = [{"id": image.id, "filename": image.filename} for image in images]
    random.shuffle(image_info)
    print(image_info)
    return jsonify(image_info)


@bp.route("/images/sortByTimeDesc")
def sorted_images_by_time_desc():
    tag = request.args.get("tag", default="")
    if tag == "Original":
        images = (
            Image.query.filter(Image.Tag == "Original")
            .order_by(Image.UploadDate.desc())
            .all()
        )
    elif tag == "Manipulation":
        images = (
            Image.query.filter(Image.Tag == "Manipulation")
            .order_by(Image.UploadDate.desc())
            .all()
        )
    elif tag == "AIGC":
        images = (
            Image.query.filter(Image.Tag == "AIGC")
            .order_by(Image.UploadDate.desc())
            .all()
        )
    else:
        images = Image.query.order_by(Image.UploadDate.desc()).all()
    image_info = [{"id": image.id, "filename": image.filename} for image in images]
    print(image_info)
    return jsonify(image_info)


@bp.route("/images/sortByTimeAsce")
def sorted_images_by_time_asce():
    tag = request.args.get("tag", default="")
    if tag == "Original":
        images = (
            Image.query.filter(Image.Tag == "Original").order_by(Image.UploadDate).all()
        )
    elif tag == "Manipulation":
        images = (
            Image.query.filter(Image.Tag == "Manipulation")
            .order_by(Image.UploadDate)
            .all()
        )
    elif tag == "AIGC":
        images = (
            Image.query.filter(Image.Tag == "AIGC").order_by(Image.UploadDate).all()
        )
    else:
        images = Image.query.order_by(Image.UploadDate).all()
    image_info = [{"id": image.id, "filename": image.filename} for image in images]
    print(image_info)
    return jsonify(image_info)


@bp.route("/images/sortByTag")
def sorted_images_by_tag():
    tag = request.args.get("tag", default="")
    search = request.args.get("search", default="")
    page = request.args.get("page", default=1, type=int)
    per_page = request.args.get("per_page", default=10, type=int)

    try:
        user_email = current_user.Email
        query = Image.query.filter(
            (Image.visibility == "public")
            | ((Image.visibility == "private") & (Image.user_email == user_email))
        )
    except AttributeError:
        query = Image.query.filter((Image.visibility == "public"))

    if tag:
        query = query.filter(Image.Tag == tag)

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(Image.ImageDescription.ilike(search_pattern))

    # 添加分页
    paginated_images = query.paginate(page=page, per_page=per_page, error_out=False)

    image_info = [
        {
            "id": image.id,
            "filename": image.filename,
            "description": image.ImageDescription,
        }
        for image in paginated_images.items
    ]

    return jsonify(
        {
            "images": image_info,
            "total": paginated_images.total,
            "pages": paginated_images.pages,
            "current_page": paginated_images.page,
        }
    )


def init(app: Flask):
    app.register_blueprint(bp)
