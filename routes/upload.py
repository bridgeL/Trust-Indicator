import os
from io import BytesIO
from datetime import datetime

from flask import (
    Blueprint,
    Flask,
    render_template,
    jsonify,
    request,
    current_app,
    session,
)
from flask_login import current_user, login_required
from werkzeug.utils import secure_filename

from database import Image, db
from routes.aigc_detector import detect_aigc
from trust_indicator.ExifExtractor.InterfaceTester import extract_exif_data

bp = Blueprint("upload", __name__)


@bp.route("/upload")
def upload():
    return render_template("html/upload.html")


@bp.route("/uploadImage", methods=["POST"])
@login_required
def upload_file():
    if request.method == "POST":
        if "file" not in request.files:
            return jsonify(error="No file part"), 400

        file = request.files["file"]

        if file.filename == "":
            return jsonify(error="No selected file"), 400

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_data = file.read()
            file.save(os.path.join(current_app.config["UPLOAD_FOLDER"], filename))
            # Here we use current_user.email to get the email of the logged-in user
            # new_image = Image(filename=filename, data=file_data, user_email=current_user.Email)
            # upload_time = datetime.utcnow()
            #
            # db.session.add(new_image)
            # db.session.commit()
            image_data_io = BytesIO(file_data)
            file_size = len(file_data)
            file_type = file.content_type
            original_filename = file.filename
            exif_data = extract_exif_data(image_data_io)
            
            if exif_data:
                colorSpace = exif_data.get("ColorSpace")
                datetime_original = exif_data.get("DateTime")
                make = exif_data.get("Make")
                model = exif_data.get("Model")
                focal_length = extract_exif_value(exif_data, "FocalLength")
                aperture = extract_exif_value(exif_data, "ApertureValue")
                exposure = extract_exif_value(exif_data, "ExposureProgram")
                iso = extract_exif_value(exif_data, "ISOSpeedRatings")
                flash = extract_exif_value(exif_data, "Flash")
                image_width = extract_exif_value(exif_data, "ExifImageWidth")
                image_length = extract_exif_value(exif_data, "ExifImageHeight")
                altitude = extract_exif_value(exif_data, "GPSAltitude")

                latitudeRef = exif_data.get("GPSLatitudeRef")
                latitude = exif_data.get("GPSLatitude")
                if isinstance(latitude, tuple) and len(latitude) == 3:
                    latitude = format_latitude(latitude)
                else:
                    latitude = None

                longitudeRef = exif_data.get("GPSLongitudeRef")
                longitude = exif_data.get("GPSLongitude")
                if isinstance(longitude, tuple) and len(longitude) == 3:
                    longitude = format_latitude(longitude)
                else:
                    longitude = None

                metadata = {
                    "ColorSpace": colorSpace if colorSpace else "None",
                    "Created": datetime_original if datetime_original else "None",
                    "Make": make if make else "None",
                    "Model": model if model else "None",
                    "FocalLength": (
                        focal_length if focal_length is not None else "None"
                    ),
                    "Aperture": (aperture if aperture is not None else "None"),
                    "Exposure": (exposure if exposure is not None else "None"),
                    "ISO": iso if iso is not None else "None",
                    "Flash": (flash if flash is not None else "None"),
                    "ImageWidth": image_width if image_width is not None else "None",
                    "ImageLength": image_length if image_length is not None else "None",
                    "Altitude": altitude if altitude is not None else "None",
                    "LatitudeRef": latitudeRef if latitudeRef is not None else "None",
                    "Latitude": latitude if latitude is not None else "None",
                    "LongitudeRef": (
                        longitudeRef if longitudeRef is not None else "None"
                    ),
                    "Longitude": longitude if longitude is not None else "None",
                }

            else:
                metadata = {
                    "ColorSpace": "unidentifiable",
                    "Created": "unidentifiable",
                    "Make": "unidentifiable",
                    "Model": "unidentifiable",
                    "FocalLength": "unidentifiable",
                    "Aperture": "unidentifiable",
                    "Exposure": "unidentifiable",
                    "ISO": "unidentifiable",
                    "Flash": "unidentifiable",
                    "ImageWidth": "unidentifiable",
                    "ImageLength": "unidentifiable",
                    "Altitude": "unidentifiable",
                    "LatitudeRef": "None",
                    "Latitude": "None",
                    "LongitudeRef": "None",
                    "Longitude": "None",
                }

                colorSpace = None
                datetime_original = None
                make = None
                model = None
                focal_length = None
                aperture = None
                exposure = None
                iso = None
                flash = None
                image_width = None
                image_length = None
                altitude = None
                latitudeRef = None
                latitude = None
                longitudeRef = None
                longitude = None

            # save the file to the database
            upload_time = datetime.utcnow()
            new_image = Image(
                filename=filename,
                data=file_data,
                # Set default visibility to private when the image is first uploaded
                visibility="private",
                user_email=current_user.Email,
                UploadDate=upload_time,  # Save the upload time
                ColorSpace=colorSpace if colorSpace else "None",
                Created=datetime_original if datetime_original else "None",
                Make=make if make else "None",
                Model=model if model else "None",
                FocalLength=focal_length,
                Aperture=aperture,
                Exposure=exposure,
                ISO=iso,
                Flash=flash,
                ImageWidth=image_width,
                ImageLength=image_length,
                Altitude=altitude,
                LatitudeRef=latitudeRef if latitudeRef else "None",
                Latitude=latitude,
                LongitudeRef=longitudeRef if longitudeRef else "None",
                Longitude=longitude,
                # Add other metadata fields as necessary
            )

            db.session.add(new_image)
            db.session.commit()

            detect_aigc(new_image.id)

            return jsonify(
                {
                    "message": "Image successfully uploaded",
                    "filename": original_filename,
                    "file_size": file_size,
                    "file_type": file_type,
                    "metadata": metadata,
                    "id": new_image.id,
                }
            )

        else:
            return jsonify(error="Allowed file types are: png, jpg, jpeg, gif"), 400


def extract_exif_value(exif_data: dict, key):
    """通用EXIF值提取和分数转换函数"""
    value = exif_data.get(key)

    if value is None:
        return None
    if hasattr(value, "numerator") and hasattr(value, "denominator"):
        return float(value.numerator) / float(value.denominator)
    try:
        return float(value)
    except (TypeError, ValueError):
        return value


@bp.route("/updateImageType", methods=["POST"])
@login_required
def update_image_type():
    image_id = request.form["imageId"]
    image_type = request.form["imageType"]
    session["image_id_for_analysis"] = image_id

    image = Image.query.get(image_id)
    if image:
        image.Tag = image_type
        db.session.commit()
        return jsonify({"status": "success"})
    else:
        return jsonify({"status": "failed"})


@bp.route("/api/updateImageDesc", methods=["POST"])
@login_required
def update_image_desc():
    image_id = request.form["image_id"]
    new_desc = request.form["desc"]

    image = Image.query.get(image_id)

    if image and image.user_email == current_user.Email:
        image.ImageDescription = new_desc
        db.session.commit()
        return jsonify({"status": "success"})
    else:
        return jsonify({"status": "failed"})


@bp.route("/api/updateImageVisibility", methods=["POST"])
def update_image_visibility():
    data = request.get_json()
    image_id = data.get("image_id")
    visibility = data.get("visibility")

    image = Image.query.get(image_id)
    if image and visibility in ["public", "private"]:
        image.visibility = visibility
        db.session.commit()
        return jsonify({"status": "success"})
    else:
        return jsonify({"status": "failed"})


def allowed_file(filename):
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower()
        in current_app.config["ALLOWED_EXTENSIONS"]
    )


def format_latitude(latitude):
    degrees, minutes, seconds = latitude
    return f"{degrees}° {minutes}' {seconds}\""


def init(app: Flask):
    app.register_blueprint(bp)
    app.config["UPLOAD_FOLDER"] = "uploads"
    app.config["ALLOWED_EXTENSIONS"] = {"jpg", "jpeg"}
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)
