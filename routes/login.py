import re
import jwt
import random
from datetime import datetime, timedelta

from flask import Blueprint, Flask, render_template, jsonify, url_for, session, request
from flask_login import logout_user, login_user, LoginManager
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.exc import IntegrityError

from database import User, db
from mail import send_email
from logger import print

bp = Blueprint("auth", __name__)

login_manager = LoginManager()


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


@bp.route("/signup")
def signup():
    return render_template("html/signup.html")


@bp.route("/login")
def login():
    return render_template("html/login.html")


@bp.route("/logout")
def logout():
    session.clear()
    logout_user()
    return render_template("html/index.html")


@bp.route("/changepassword")
def changepassword():
    return render_template("html/changepassword.html")


def generate_token(email, code):
    payload = {
        "email": email,
        "code": code,
        "exp": datetime.utcnow() + timedelta(minutes=10),
    }
    token = jwt.encode(payload, "your_secret_key", algorithm="HS256")
    return token


@bp.route("/send-code", methods=["POST"])
def send_code():
    data = request.get_json()
    email = data.get("email")
    if not email:
        return jsonify({"message": "Email address is required."}), 400

    code = "".join([str(random.randint(0, 9)) for _ in range(4)])
    token = generate_token(email, code)

    rendered_html = render_template(
        "html/verification_email.html", code=code, year=datetime.now().year
    )

    send_email(
        "Your Verification Code",
        email,
        "Your email verification code is provided in the HTML part of this email.",
        rendered_html,
    )

    return jsonify({"message": "Verification code sent.", "token": token})


@bp.route("/verify-code", methods=["POST"])
def verify_code():
    data = request.get_json()
    token = data.get("token")
    user_code = data.get("code")

    try:
        decoded = jwt.decode(token, "your_secret_key", algorithms=["HS256"])
        if decoded.get("code") == user_code:
            return (
                jsonify({"message": "Verification successful.", "status": "success"}),
                200,
            )
        else:
            return (
                jsonify({"message": "Verification failed. The code does not match."}),
                400,
            )
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token expired"}), 400
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token"}), 400


# signup function
@bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("UserName")
    email = data.get("Email")
    legal_name = data.get("LegalName")
    password = data.get("Password")

    email_regex = r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)"
    if not re.match(email_regex, email):
        return jsonify({"message": "Invalid email format."}), 400
    password_regex = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,12}$"
    if not re.match(password_regex, password):
        return jsonify({"message": "Password does not meet requirements."}), 400

    hashed_password = generate_password_hash(password, method="pbkdf2:sha256")
    # add to database
    new_user = User(
        UserName=username,
        Email=email,
        LegalName=legal_name,
        Password=hashed_password,
        ProfilePhotoNO=str(random.randint(1, 3)),
    )
    db.session.add(new_user)
    print("username:", username, "email:", email)
    try:
        db.session.commit()
        return jsonify({"message": "User registered successfully."}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"message": "Email already exists."}), 400


# change password
@bp.route("/change-password", methods=["POST"])
def change_password():
    data = request.get_json()
    if not data:
        return jsonify({"status": "error", "message": "No data provided."}), 403

    email = data["email"]
    old_password = data["old-password"]
    new_password = data["new-password"]
    confirm_new_password = data["confirm-new-password"]

    user = User.query.filter_by(Email=email).first()

    if user and check_password_hash(user.Password, old_password):
        if new_password == confirm_new_password:
            user.Password = generate_password_hash(new_password)
            db.session.commit()
            return (
                jsonify(
                    {
                        "status": "success",
                        "message": "Password updated successfully.",
                        "redirect": url_for("auth.login"),
                    }
                ),
                200,
            )
        else:
            return (
                jsonify(
                    {"status": "invalid", "message": "New passwords do not match."}
                ),
                400,
            )
    else:
        return (
            jsonify({"status": "error", "message": "Incorrect email or password."}),
            401,
        )


@bp.route("/reset-password", methods=["POST"])
def reset_password():
    email = request.json.get("email")
    new_password = request.json.get("newPassword")

    user = User.query.filter_by(Email=email).first()
    if user:
        if user.Password != generate_password_hash(new_password):
            password_regex = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,12}$"
            if not re.match(password_regex, new_password):
                return (
                    jsonify(
                        {
                            "status": "error",
                            "message": "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
                        }
                    ),
                    401,
                )
            user.Password = generate_password_hash(new_password)
            db.session.commit()
            return (
                jsonify(
                    {
                        "status": "success",
                        "message": "Password has been updated successfully.",
                    }
                ),
                200,
            )
        else:
            return jsonify({"status": "error", "message": "Need a new password."}), 500
    else:
        return jsonify({"status": "error", "message": "User not found."}), 404


@bp.route("/login_function", methods=["POST"])
def login_function():
    # Get data from the request
    data = request.get_json()
    username_or_email = data.get("username")
    password = data.get("password")

    # Query the user in the database
    user = User.query.filter(
        (User.UserName == username_or_email) | (User.Email == username_or_email)
    ).first()

    # Verify the password and log in the user
    if user and check_password_hash(user.Password, password):
        login_user(user)
        return jsonify({"message": "Logged in successfully"}), 200
    else:
        return jsonify({"message": "Invalid username or password"}), 401


def init(app: Flask):
    login_manager.init_app(app)
    app.register_blueprint(bp)
