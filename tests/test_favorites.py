import sys
import os
from flask import Flask
import unittest
from test_model import DatabaseTest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from database import db, create_database, User, Image, Feedback, Favorites

class FavoritesTest(DatabaseTest):

    def test_favorite_insertion(self):
        """Test inserting a favorite record."""
        with self.app.app_context():
            user = User(UserName="testuser", Email="test@example.com", Password="hashed_password")
            db.session.add(user)
            db.session.commit()

            image = Image(filename="test_image.jpg", user_email="test@example.com", Tag="nature", visibility="public")
            db.session.add(image)
            db.session.commit()

            favorite = Favorites(
                ImageID=image.id,
                UserID=user.id,
                FileName=image.filename,
                Rate=5,
                Is_Favorite=1,
                Comment="Beautiful image",
                Create_Date="2025-03-28"
            )
            db.session.add(favorite)
            db.session.commit()

            fetched_favorite = Favorites.query.filter_by(UserID=user.id, ImageID=image.id).first()
            self.assertIsNotNone(fetched_favorite)
            self.assertEqual(fetched_favorite.FileName, "test_image.jpg")
            self.assertEqual(fetched_favorite.Is_Favorite, 1)

    def test_favorite_update(self):
        """Test updating the Is_Favorite field."""
        with self.app.app_context():
            user = User(UserName="testuser2", Email="user2@example.com", Password="hashed_password")
            db.session.add(user)
            db.session.commit()

            image = Image(filename="sample.jpg", user_email="user2@example.com", Tag="landscape", visibility="public")
            db.session.add(image)
            db.session.commit()

            favorite = Favorites(
                ImageID=image.id,
                UserID=user.id,
                FileName=image.filename,
                Rate=3,
                Is_Favorite=1,
                Comment="Nice landscape",
                Create_Date="2025-03-28"
            )
            db.session.add(favorite)
            db.session.commit()

            favorite.Is_Favorite = 0
            db.session.commit()

            updated_favorite = Favorites.query.filter_by(UserID=user.id, ImageID=image.id).first()
            self.assertEqual(updated_favorite.Is_Favorite, 0)

    def test_favorite_deletion(self):
        """Test deleting a favorite record."""
        with self.app.app_context():
            user = User(UserName="testuser3", Email="user3@example.com", Password="hashed_password")
            db.session.add(user)
            db.session.commit()

            image = Image(filename="delete_me.jpg", user_email="user3@example.com", Tag="portrait", visibility="private")
            db.session.add(image)
            db.session.commit()

            favorite = Favorites(
                ImageID=image.id,
                UserID=user.id,
                FileName=image.filename,
                Rate=4,
                Is_Favorite=1,
                Comment="Will delete this",
                Create_Date="2025-03-28"
            )
            db.session.add(favorite)
            db.session.commit()

            # Delete the favorite record
            db.session.delete(favorite)
            db.session.commit()

            # Verify deletion
            deleted_favorite = Favorites.query.filter_by(UserID=user.id, ImageID=image.id).first()
            self.assertIsNone(deleted_favorite)

if __name__ == '__main__':
    unittest.main()