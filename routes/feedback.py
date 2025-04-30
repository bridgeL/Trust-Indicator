from datetime import datetime
from flask import Blueprint, Flask, render_template, jsonify, request
from database import Feedback, db
from extension import send_email

bp = Blueprint("feedback", __name__)


@bp.route("/feedback")
def GoToFeedback():
    source = request.args.get("source", "")
    return render_template("html/feedback.html", source=source)


@bp.route("/submit_feedback", methods=["POST"])
def submit_feedback():
    data = request.get_json()
    if data:
        name = data.get("name")
        email = data.get("email")
        feedback_type = data.get("feedback-type")
        content = data.get("feedback")

        new_feedback = Feedback(
            name=name,
            email=email,
            date=datetime.utcnow(),
            feedback_type=feedback_type,
            content=content,
        )
        db.session.add(new_feedback)
        db.session.commit()

        rendered_html = render_template(
            "html/feedback_confirmation.html",
            name=name,
            feedback_type=feedback_type,
            year=datetime.now().year,
        )

        send_email(
            "We Received Your Feedback",
            email,
            "Your email verification code is provided in the HTML part of this email.",
            rendered_html,
        )

        return (
            jsonify(
                {
                    "status": "success",
                    "message": "Thank you for your feedback. A confirmation email has been sent to you.",
                }
            ),
            200,
        )
    return jsonify({"status": "error", "message": "Error, please try again."}), 400


def init(app: Flask):
    app.register_blueprint(bp)
