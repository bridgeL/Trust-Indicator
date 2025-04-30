from flask import Blueprint, Flask, render_template, jsonify, request
from flask_login import current_user, login_required

from database import Image, User, Favorites, db

bp = Blueprint("user_profile", __name__)


@bp.route("/userprofile")
@login_required
def userprofile():
    return render_template("html/userprofile.html", user=current_user)


@bp.route("/getcurrentuserimages")
def get_current_user_images():
    user_email = current_user.Email

    images = Image.query.filter_by(user_email=user_email).all()
    image_info = [{"id": image.id, "filename": image.filename} for image in images]
    return jsonify(image_info)


@bp.route("/change_profile_photo", methods=["POST"])
@login_required
def change_profile_photo():
    selected_image_number = request.form.get("selected_image")
    if selected_image_number:
        try:
            selected_image_number = int(selected_image_number)
        except ValueError:
            return jsonify({"status": "error", "message": "Invalid image number."}), 400

        if 1 <= selected_image_number <= 16:
            user = User.query.get(current_user.id)
            if user:
                user.ProfilePhotoNO = selected_image_number
                db.session.commit()
                return (
                    jsonify(
                        {
                            "status": "success",
                            "message": "Profile photo updated successfully.",
                        }
                    ),
                    200,
                )
            else:
                return jsonify({"status": "error", "message": "User not found"}), 404
        else:
            return (
                jsonify({"status": "error", "message": "Image number out of range."}),
                400,
            )
    return jsonify({"status": "error", "message": "No image selected."}), 400


@bp.route("/get_current_user", methods=["GET"])
def get_current_user():
    if current_user and current_user.is_authenticated:
        user_info = {"name": current_user.LegalName, "email": current_user.Email}
    else:
        user_info = {"name": "", "email": ""}
    return jsonify(user_info), 200


@bp.route("/getAllFavouritesByUser")
def getAllFavouritesByUser():
    favorites = Favorites.query.filter_by(UserID=current_user.id).all()
    favorites_list = [
        {"id": favorite.RecordID, "filename": favorite.FileName}
        for favorite in favorites
    ]

    return jsonify(favorites_list)


def init(app: Flask):
    app.register_blueprint(bp)
