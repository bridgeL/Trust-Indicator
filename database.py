import os
from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from flask import Flask
import sys 

# # preparation to create db
# app = Flask(__name__)
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///MyDatabase.db'
# db = SQLAlchemy(app)
db = SQLAlchemy()

class User(UserMixin, db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    UserName = db.Column(db.String(80), nullable=False)
    Email = db.Column(db.String(120), unique=True, nullable=False)
    Password = db.Column(db.String(100))
    LegalName = db.Column(db.String(100))
    ProfilePhotoNO = db.Column(db.String(100))
    Is_Admin = db.Column(db.Boolean, default=False)
    images = db.relationship('Image', backref='user', lazy=True)
    trust_profile = db.relationship('TrustProfile', backref='user', uselist=False, lazy=True)

class TrustProfile(db.Model):
    __tablename__ = 'trust_profile'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    last_updated = db.Column(db.Text)
    snippets = db.relationship('TrustSnippet', backref='trust_profile', lazy=True)

class TrustSnippet(db.Model):
    __tablename__ = 'trust_snippet'
    id = db.Column(db.Integer, primary_key=True)
    profile_id = db.Column(db.Integer, db.ForeignKey('trust_profile.id'), nullable=False)
    snippet_type = db.Column(db.String(50), nullable=False) # 'ai_threshold', 'megadata_complete'
    settings = db.Column(db.Text) # Used to store settings in JSON format, such as the specific value of AI threshold
    enabled = db.Column(db.Boolean, default=True)

class Favorites(db.Model):
    __tablename__ = 'favorites'
    RecordID = db.Column(db.Integer, primary_key=True)
    ImageID = db.Column(db.Integer, db.ForeignKey('images.id'), nullable=False)
    UserID = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    FileName = db.Column(db.String(120))
    Rate = db.Column(db.Integer)
    Is_Favorite = db.Column(db.Integer)
    Comment = db.Column(db.Text)
    Create_Date = db.Column(db.Text)

class Feedback(db.Model):
    __tablename__ = 'feedback'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    date = db.Column(db.Text)
    feedback_type = db.Column(db.String(120))
    content = db.Column(db.Text)

# for visibility enum
class VisibilityEnum:
    PUBLIC = "public"
    PRIVATE = "private"
    CHOICES = (PUBLIC, PRIVATE)

class Image(db.Model):
    __tablename__ = 'images'
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(150))
    data = db.Column(db.LargeBinary)  # 用于存储图片的二进制数据
    user_email = db.Column(db.String(120), db.ForeignKey('user.Email'), nullable=False)
    ImageTitle = db.Column(db.Text)
    ImageDescription = db.Column(db.Text)
    UploadDate = db.Column(db.Text)
    Tag = db.Column(db.Text)
    # Add fields for metadata
    # IsPrivate = db.Column(db.Boolean, default=False)
    visibility = db.Column(db.String(10), nullable=False, default=VisibilityEnum.PUBLIC)
    ai_prob = db.Column(db.Float, nullable=True)

    ColorSpace = db.Column(db.Text)
    Created = db.Column(db.Text)
    Make = db.Column(db.Text)
    Model = db.Column(db.Text)
    FocalLength = db.Column(db.Float, nullable=True)
    Aperture = db.Column(db.Float, nullable=True)
    Exposure = db.Column(db.Float, nullable=True)
    ISO = db.Column(db.Float, nullable=True)
    Flash = db.Column(db.Float, nullable=True)
    ImageWidth = db.Column(db.Float, nullable=True)
    ImageLength = db.Column(db.Float, nullable=True)
    Altitude = db.Column(db.Text, nullable=True)
    LatitudeRef = db.Column(db.Text)
    Latitude = db.Column(db.Text, nullable=True)
    LongitudeRef = db.Column(db.Text)
    Longitude = db.Column(db.Text, nullable=True)


def create_database(app):
    """Create SQLite database if it doesn't exist."""
    if not os.path.exists('instance/MyDatabase.db'):
        with app.app_context():
            # db.init_app(app)
            db.create_all()
        print("Database created!")

# if __name__ == "__main__":
#     if len(sys.argv) > 1 and sys.argv[1] == '--recreate':
#         db_path = os.path.join(app.instance_path, 'instance/MyDatabase.db')
#         if os.path.exists(db_path):
#             os.remove(db_path)
#         print("Database removed.")
    
#     with app.app_context():
#         db.create_all()
#         print("Database created.")
