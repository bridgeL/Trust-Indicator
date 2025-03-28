import sys
import os
from flask import Flask
import unittest
from test_model import DatabaseTest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from database import db, create_database, User, Image, Feedback, Favorites

class ImageTest(DatabaseTest):

    def test_image_insertion(self):
        """Test the Image table insertion and retrieval."""
        with self.app.app_context():
            image = Image(
                filename="fake_image.jpg",  # Fake file name (no actual file needed)
                user_email="test@example.com",  # Fake user email
                Tag="sample_tag",  # Example tag
                visibility="private"  # Visibility set to private
            )
            db.session.add(image)
            db.session.commit()

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

    def test_image_deletion(self):
        """Test that an image can be deleted from the database."""
        with self.app.app_context():
            image = Image(
                filename="to_be_deleted.jpg",
                user_email="test@example.com",
                Tag="delete_tag",
                visibility="private"
            )
            db.session.add(image)
            db.session.commit()

            # Verify image exists before deletion
            fetched_image = db.session.query(Image).filter_by(filename="to_be_deleted.jpg").first()
            self.assertIsNotNone(fetched_image)

            # Delete the image
            db.session.delete(fetched_image)
            db.session.commit()

            # Verify image no longer exists
            deleted_image = db.session.query(Image).filter_by(filename="to_be_deleted.jpg").first()
            self.assertIsNone(deleted_image)

    def test_fetch_images_by_user(self):
        """Test retrieving images that belong to a specific user."""
        with self.app.app_context():
            # Insert multiple images for the same user
            db.session.add_all([
                Image(filename="user_img1.jpg", user_email="user@example.com", Tag="tag1", visibility="public"),
                Image(filename="user_img2.jpg", user_email="user@example.com", Tag="tag2", visibility="private"),
                Image(filename="another_user_img.jpg", user_email="another@example.com", Tag="tag3", visibility="public")
            ])
            db.session.commit()

            # Fetch images for user@example.com
            user_images = db.session.query(Image).filter_by(user_email="user@example.com").all()
            self.assertEqual(len(user_images), 2)  # Should return only 2 images for this user

    def test_fetch_only_public_images(self):
        """Test retrieving only public images."""
        with self.app.app_context():
            db.session.add_all([
                Image(filename="public1.jpg", user_email="user1@example.com", Tag="tag1", visibility="public"),
                Image(filename="private1.jpg", user_email="user1@example.com", Tag="tag2", visibility="private"),
                Image(filename="public2.jpg", user_email="user2@example.com", Tag="tag3", visibility="public")
            ])
            db.session.commit()

            public_images = db.session.query(Image).filter_by(visibility="public").all()
            self.assertEqual(len(public_images), 2)  # Only 2 images should be public

    def test_fetch_private_images_for_user(self):
        """Test that a user can only access their own private images."""
        with self.app.app_context():
            db.session.add_all([
                Image(filename="private_user1.jpg", user_email="user1@example.com", Tag="tag1", visibility="private"),
                Image(filename="private_user2.jpg", user_email="user2@example.com", Tag="tag2", visibility="private"),
                Image(filename="public_image.jpg", user_email="user1@example.com", Tag="tag3", visibility="public")
            ])
            db.session.commit()

            user1_private_images = db.session.query(Image).filter_by(user_email="user1@example.com", visibility="private").all()
            self.assertEqual(len(user1_private_images), 1)
            self.assertEqual(user1_private_images[0].filename, "private_user1.jpg")

    def test_change_visibility_private_to_public(self):
        """Test changing an image's visibility from private to public."""
        with self.app.app_context():
            image = Image(
                filename="change_visibility.jpg",
                user_email="test@example.com",
                Tag="test_tag",
                visibility="private"
            )
            db.session.add(image)
            db.session.commit()

            # Change visibility
            image.visibility = "public"
            db.session.commit()

            updated_image = db.session.query(Image).filter_by(filename="change_visibility.jpg").first()
            self.assertEqual(updated_image.visibility, "public")

    def test_change_visibility_public_to_private(self):
        """Test changing an image's visibility from public to private."""
        with self.app.app_context():
            image = Image(
                filename="public_to_private.jpg",
                user_email="test@example.com",
                Tag="test_tag",
                visibility="public"
            )
            db.session.add(image)
            db.session.commit()

            # Change visibility
            image.visibility = "private"
            db.session.commit()

            updated_image = db.session.query(Image).filter_by(filename="public_to_private.jpg").first()
            self.assertEqual(updated_image.visibility, "private")

if __name__ == '__main__':
    unittest.main()
