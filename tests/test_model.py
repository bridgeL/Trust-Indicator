import sys
import os
from flask import Flask
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from database import db, create_database, User, Image, Feedback, Favorites

class DatabaseTest(unittest.TestCase):
    def create_app(self):
        """Create a new Flask app instance for each test with in-memory DB."""
        app = Flask(__name__)
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'  # In-memory database
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        app.config['TESTING'] = True  # Enable testing mode
        db.init_app(app)  # Initialize db for the new app
        return app

    def setUp(self):
        """Set up the test environment for each test case."""
        app = self.create_app()
        self.app = app
        self.client = app.test_client()  # Create a test client
        with app.app_context():
            db.create_all()  # Create tables for testing

    def tearDown(self):
        """Clean up after each test."""
        with self.app.app_context():
            db.session.remove()
            db.drop_all()  # Drop tables after tests

    # def test_user_table(self):
    #     """Test the User table insertion and retrieval."""
    #     with self.app.app_context():
    #         # Define the User model (same as your original models)
    #         class User(db.Model):
    #             id = db.Column(db.Integer, primary_key=True)
    #             email = db.Column(db.String(120), unique=True, nullable=False)
    #             password = db.Column(db.String(128), nullable=False)

    #         # Insert a new user
    #         user = User(
    #             email="test@example.com",
    #             password="password123"  # In real apps, you'd hash the password
    #         )
    #         db.session.add(user)
    #         db.session.commit()

    #         # Fetch the user from the database
    #         fetched_user = db.session.query(User).filter_by(email="test@example.com").first()
    #         self.assertIsNotNone(fetched_user)
    #         self.assertEqual(fetched_user.email, "test@example.com")
    #         self.assertEqual(fetched_user.password, "password123")

    # def test_image_table(self):
    #     with self.app.app_context():
    #         # Insert a new image with fake data
    #         image = Image(
    #             filename="fake_image.jpg",  # Fake file name (no actual file needed)
    #             user_email="test@example.com",  # Fake user email
    #             Tag="sample_tag",  # Example tag
    #             visibility="private"  # Visibility set to private
    #         )
    #         db.session.add(image)
    #         db.session.commit()

    #         # Fetch the image from the database
    #         fetched_image = db.session.query(Image).filter_by(filename="fake_image.jpg").first()
    #         self.assertIsNotNone(fetched_image)
    #         self.assertEqual(fetched_image.filename, "fake_image.jpg")
    #         self.assertEqual(fetched_image.visibility, "private")

# if __name__ == '__main__':
#     unittest.main()
