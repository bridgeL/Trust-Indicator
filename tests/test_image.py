import sys
import os
from flask import Flask
import unittest
from test_driver import DatabaseTest  # Import the common test class

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from database import db, create_database, User, Image, Feedback, Favorites

class ImageTest(DatabaseTest):

    def test_image_insertion(self):
        """Test the Image table insertion and retrieval."""
        with self.app.app_context():
            # Insert a new image with fake data
            image = Image(
                filename="fake_image.jpg",  # Fake file name (no actual file needed)
                user_email="test@example.com",  # Fake user email
                Tag="sample_tag",  # Example tag
                visibility="private"  # Visibility set to private
            )
            db.session.add(image)
            db.session.commit()

            # Fetch the image from the database
            fetched_image = db.session.query(Image).filter_by(filename="fake_image.jpg").first()
            self.assertIsNotNone(fetched_image)
            self.assertEqual(fetched_image.filename, "fake_image.jpg")
            self.assertEqual(fetched_image.visibility, "private")

    def test_image_update(self):
        """Test the update of an image's visibility."""
        with self.app.app_context():
            image = Image(
                filename="another_fake_image.jpg",
                user_email="test@example.com",
                Tag="another_tag",
                visibility="private"
            )
            db.session.add(image)
            db.session.commit()

            # Update image visibility
            image.visibility = "public"
            db.session.commit()

            # Fetch updated image
            updated_image = db.session.query(Image).filter_by(id=image.id).first()
            self.assertEqual(updated_image.visibility, "public")

if __name__ == '__main__':
    unittest.main()
