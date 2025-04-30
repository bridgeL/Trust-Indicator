from datetime import datetime

from flask import Blueprint, Flask, render_template, jsonify, request
from flask_login import current_user

from database import Image, Favorites, db

bp = Blueprint("image_detail", __name__)


@bp.route("/imagedetail")
def imagedetail():
    source = request.args.get("source", "")
    return render_template("html/imagedetail.html", source=source)


@bp.route("/addToFavourite", methods=["POST"])
def addToFavourite():
    if current_user and current_user.is_authenticated:
        user_id = current_user.id
        image_id = request.json.get("image_id")

        if not user_id or not image_id:
            return jsonify({"error": "Missing user_id or image_id"}), 401

        existing_favorite = Favorites.query.filter_by(
            UserID=user_id, ImageID=image_id
        ).first()
        if existing_favorite:
            return jsonify({"error": "Image already in favorites"}), 500
        image = Image.query.filter_by(id=image_id).first()
        new_favorite = Favorites(
            UserID=user_id,
            FileName=image.filename,
            ImageID=image_id,
            Is_Favorite=1,
            Create_Date=datetime.utcnow(),
        )
        db.session.add(new_favorite)
        db.session.commit()

        return jsonify({"message": "Image added to favorites successfully"}), 201
    return jsonify({"error": "Please login to add favourite."}), 401


@bp.route("/checkFavourite", methods=["POST"])
def checkFavourite():
    if current_user and current_user.is_authenticated:
        user_id = current_user.id
        image_id = request.json.get("image_id")
        existing_favorite = Favorites.query.filter_by(
            UserID=user_id, ImageID=image_id
        ).first()
        if existing_favorite:
            return jsonify({"isFavourite": True})
    return jsonify({"isFavourite": False})


@bp.route("/deleteFavourite", methods=["POST"])
def deleteFavourite():
    user_id = current_user.id
    image_id = request.json.get("image_id")
    if not user_id or not image_id:
        return jsonify({"error": "Missing user_id or image_id"}), 400
    favorite_to_remove = Favorites.query.filter_by(
        UserID=user_id, ImageID=image_id
    ).first()
    if not favorite_to_remove:
        return jsonify({"message": "No such favorite found"}), 404
    db.session.delete(favorite_to_remove)
    db.session.commit()
    return jsonify({"message": "Favorite removed successfully"}), 200


@bp.route("/getimagedetail/<int:image_id>")
def getImageDetail(image_id):
    if image_id is None:
        return jsonify({"error": "Missing image ID"}), 400

    image = Image.query.get(image_id)
    if image is None:
        return jsonify({"error": "Image not found"}), 404

    image_detail = {
        "id": image.id,
        "filename": image.filename,
        "user_email": image.user_email,
        "ImageTitle": image.ImageTitle,
        "ImageDescription": image.ImageDescription,
        "UploadDate": image.UploadDate,
        "ai_prob": image.ai_prob,
        "visibility": image.visibility,
        "Tag": image.Tag,
        "ColorSpace": image.ColorSpace,
        "Created": image.Created,
        "Make": image.Make,
        "Model": image.Model,
        "FocalLength": image.FocalLength,
        "Aperture": image.Aperture,
        "Exposure": image.Exposure,
        "ISO": image.ISO,
        "Flash": image.Flash,
        "ImageWidth": image.ImageWidth,
        "ImageLength": image.ImageLength,
        "Altitude": image.Altitude,
        "LatitudeRef": image.LatitudeRef,
        "Latitude": image.Latitude,
        "LongitudeRef": image.LongitudeRef,
        "Longitude": image.Longitude,
    }
    return jsonify(image_detail)


def init(app: Flask):
    app.register_blueprint(bp)
