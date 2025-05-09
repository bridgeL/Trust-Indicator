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
                # with open("exif_data.txt", "w") as file:
                #     for key, value in exif_data.items():
                #         file.write(f"{key}: {value}\n")
                colorSpace = exif_data.get("ColorSpace")
                datetime_original = exif_data.get("DateTime")
                make = exif_data.get("Make")
                model = exif_data.get("Model")
                focal_length = exif_data.get("FocalLength")
                if focal_length:
                    if hasattr(focal_length, "numerator") and hasattr(
                        focal_length, "denominator"
                    ):
                        focal_length_value = float(focal_length.numerator) / float(
                            focal_length.denominator
                        )
                    else:
                        focal_length_value = float(focal_length)
                else:
                    focal_length_value = None
                aperture = exif_data.get("ApertureValue")
                if aperture:
                    if hasattr(aperture, "numerator") and hasattr(
                        aperture, "denominator"
                    ):
                        aperture_length_value = float(aperture.numerator) / float(
                            aperture.denominator
                        )
                    else:
                        aperture_length_value = float(aperture)
                else:
                    aperture_length_value = None
                exposure = exif_data.get("ExposureProgram")
                if exposure:
                    if hasattr(exposure, "numerator") and hasattr(
                        exposure, "denominator"
                    ):
                        exposure_length_value = float(exposure.numerator) / float(
                            exposure.denominator
                        )
                    else:
                        exposure_length_value = float(exposure)
                else:
                    exposure_length_value = None
                iso = exif_data.get("ISOSpeedRatings")
                if iso:
                    if hasattr(iso, "numerator") and hasattr(iso, "denominator"):
                        iso_length_value = float(iso.numerator) / float(iso.denominator)
                    else:
                        iso_length_value = float(iso)
                else:
                    iso_length_value = None

                flash = exif_data.get("Flash")
                if flash:
                    if hasattr(flash, "numerator") and hasattr(flash, "denominator"):
                        flash_length_value = float(flash.numerator) / float(
                            flash.denominator
                        )
                    else:
                        flash_length_value = float(flash)
                else:
                    flash_length_value = None

                image_width = exif_data.get("ExifImageWidth")
                if image_width:
                    if hasattr(image_width, "numerator") and hasattr(
                        image_width, "denominator"
                    ):
                        image_width = float(image_width.numerator) / float(
                            image_width.denominator
                        )
                    else:
                        image_width = float(image_width)
                else:
                    image_width = None

                image_length = exif_data.get("ExifImageHeight")
                if image_length:
                    if hasattr(image_length, "numerator") and hasattr(
                        image_length, "denominator"
                    ):
                        image_length = float(image_length.numerator) / float(
                            image_length.denominator
                        )
                    else:
                        image_length = float(image_length)
                else:
                    image_length = None

                altitude = exif_data.get("GPSAltitude")
                if altitude:
                    if hasattr(altitude, "numerator") and hasattr(
                        altitude, "denominator"
                    ):
                        altitude = float(altitude.numerator) / float(
                            altitude.denominator
                        )
                    else:
                        altitude = float(altitude)
                else:
                    altitude = None

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
                        focal_length_value if focal_length_value is not None else "None"
                    ),
                    "Aperture": (
                        aperture_length_value
                        if aperture_length_value is not None
                        else "None"
                    ),
                    "Exposure": (
                        exposure_length_value
                        if exposure_length_value is not None
                        else "None"
                    ),
                    "ISO": iso_length_value if iso_length_value is not None else "None",
                    "Flash": (
                        flash_length_value if flash_length_value is not None else "None"
                    ),
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
                FocalLength=focal_length_value,
                Aperture=aperture_length_value,
                Exposure=exposure_length_value,
                ISO=iso_length_value,
                Flash=flash_length_value,
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
