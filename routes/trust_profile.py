from datetime import datetime

from flask import Blueprint, Flask, render_template, jsonify, request, current_app
from flask_login import current_user, login_required

from database import TrustProfile, TrustSnippet, db

bp = Blueprint("trust_profile", __name__)


@bp.route("/get_trust_profile")
@login_required
def get_trust_profile():
    """Get the current user's Trust Profile"""
    try:
        user_id = current_user.id

        # Check if trust_profile table exists
        try:
            trust_profile = TrustProfile.query.filter_by(user_id=user_id).first()
        except Exception as e:
            # If table doesn't exist, return a more helpful error
            return jsonify(
                {
                    "status": "error",
                    "message": "Database error: Trust Profile table not found. Please run create_tables.py to initialize the database.",
                    "profile": {"id": None, "snippets": []},
                }
            )

        if not trust_profile:
            # If the user doesn't have a Trust Profile, create an empty one
            try:
                trust_profile = TrustProfile(
                    user_id=user_id, last_updated=datetime.utcnow()
                )
                db.session.add(trust_profile)
                db.session.commit()
            except Exception as e:
                # Return empty profile if we can't create one
                return jsonify({"profile": {"id": None, "snippets": []}})

            return jsonify({"profile": {"id": trust_profile.id, "snippets": []}})

        try:
            snippets = TrustSnippet.query.filter_by(profile_id=trust_profile.id).all()
            snippets_list = []

            for snippet in snippets:
                snippets_list.append(
                    {
                        "id": snippet.id,
                        "type": snippet.snippet_type,
                        "settings": snippet.settings,
                        "enabled": snippet.enabled,
                    }
                )

            return jsonify(
                {
                    "profile": {
                        "id": trust_profile.id,
                        "last_updated": trust_profile.last_updated,
                        "snippets": snippets_list,
                    }
                }
            )
        except Exception as e:
            # Return empty profile if we can't fetch snippets
            return jsonify({"profile": {"id": trust_profile.id, "snippets": []}})
    except Exception as e:
        # Log the error
        current_app.logger.error(f"Error getting trust profile: {str(e)}")
        # Return empty profile
        return jsonify(
            {
                "status": "error",
                "message": f"Error fetching Trust Profile: {str(e)}",
                "profile": {"id": None, "snippets": []},
            }
        )


@bp.route("/save_trust_profile", methods=["POST"])
@login_required
def save_trust_profile():
    """Save the user's Trust Profile"""
    try:
        user_id = current_user.id
        data = request.get_json()

        if not data or "snippets" not in data:
            return jsonify({"status": "error", "message": "Invalid data format"}), 400

        # Check if trust_profile table exists
        try:
            trust_profile = TrustProfile.query.filter_by(user_id=user_id).first()
        except Exception as e:
            # If table doesn't exist, return a more helpful error
            return (
                jsonify(
                    {
                        "status": "error",
                        "message": "Database error: Trust Profile table not found. Please run create_tables.py to initialize the database.",
                    }
                ),
                500,
            )

        if not trust_profile:
            trust_profile = TrustProfile(
                user_id=user_id, last_updated=datetime.utcnow()
            )
            db.session.add(trust_profile)
            db.session.commit()

        # Delete old snippets
        TrustSnippet.query.filter_by(profile_id=trust_profile.id).delete()

        # Add new snippets
        for snippet_data in data["snippets"]:
            new_snippet = TrustSnippet(
                profile_id=trust_profile.id,
                snippet_type=snippet_data["type"],
                settings=snippet_data["settings"],
                enabled=snippet_data.get("enabled", True),
            )
            db.session.add(new_snippet)

        trust_profile.last_updated = datetime.utcnow()
        db.session.commit()

        return jsonify(
            {"status": "success", "message": "Trust Profile saved successfully"}
        )
    except Exception as e:
        # Log the error for debugging
        current_app.logger.error(f"Error saving trust profile: {str(e)}")
        # Return user-friendly error
        return (
            jsonify(
                {"status": "error", "message": f"Error saving Trust Profile: {str(e)}"}
            ),
            500,
        )


@bp.route("/get_available_snippets")
@login_required
def get_available_snippets():
    """Get available Trust Profile snippets for user selection"""
    available_snippets = [
        {
            "type": "ai_threshold",
            "name": "AI Content Threshold",
            "description": "Set acceptable AI rate threshold for photos",
            "settings": {"threshold": 50},  # Default value
        },
        {
            "type": "megadata_complete",
            "name": "MegaData Completeness Check",
            "description": "Reject photos with incomplete MegaData",
            "settings": {},  # No additional settings needed
        },
    ]

    return jsonify({"snippets": available_snippets})


@bp.route("/trust_profile_edit")
@login_required
def trust_profile_edit():
    """Trust Profile edit page"""
    return render_template(
        "html/userprofile.html", user=current_user, show_trust_editor=True
    )


def init(app: Flask):
    app.register_blueprint(bp)
