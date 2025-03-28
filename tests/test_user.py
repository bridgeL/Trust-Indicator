import sys
import os
from flask import Flask
import unittest
from test_model import DatabaseTest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from database import db, create_database, User, Image, Feedback, Favorites


class UserTest(DatabaseTest):

    def test_user_insertion(self):
        """Test inserting a user into the User table."""
        with self.app.app_context():
            user = User(
                UserName="test_user",
                Email="testuser@example.com",
                Password="password123",  # Password can be in plaintext for testing purposes, but should be hashed in a real scenario
                LegalName="Test User",
                ProfilePhotoNO=1,  # Example photo number
                Is_Admin=0  # Regular user
            )
            db.session.add(user)
            db.session.commit()

            fetched_user = db.session.query(User).filter_by(Email="testuser@example.com").first()

            self.assertIsNotNone(fetched_user)
            self.assertEqual(fetched_user.UserName, "test_user")
            self.assertEqual(fetched_user.Email, "testuser@example.com")
            self.assertEqual(fetched_user.LegalName, "Test User")
            self.assertEqual(fetched_user.Is_Admin, 0)

    def test_user_update(self):
        """Test updating a user's data."""
        with self.app.app_context():
            # Insert a new user
            user = User(
                UserName="test_user2",
                Email="testuser2@example.com",
                Password="password123",
                LegalName="Test User Two",
                ProfilePhotoNO=1,
                Is_Admin=0
            )
            db.session.add(user)
            db.session.commit()

            # Update the user's email and legal name
            user.Email = "updateduser2@example.com"
            user.LegalName = "Updated Test User Two"
            db.session.commit()

            # Fetch the updated user
            updated_user = db.session.query(User).filter_by(Email="updateduser2@example.com").first()

            # Assertions to verify the update
            self.assertEqual(updated_user.Email, "updateduser2@example.com")
            self.assertEqual(updated_user.LegalName, "Updated Test User Two")

    def test_user_delete(self):
        """Test deleting a user."""
        with self.app.app_context():
            # Insert a new user
            user = User(
                UserName="test_user3",
                Email="testuser3@example.com",
                Password="password123",
                LegalName="Test User Three",
                ProfilePhotoNO=1,
                Is_Admin=0
            )
            db.session.add(user)
            db.session.commit()

            # Delete the user
            db.session.delete(user)
            db.session.commit()

            # Assert that the user no longer exists
            deleted_user = db.session.query(User).filter_by(Email="testuser3@example.com").first()
            self.assertIsNone(deleted_user)

    def test_user_unique_email(self):
        """Test that the user's email is unique."""
        with self.app.app_context():
            # Insert a new user
            user1 = User(
                UserName="test_user4",
                Email="testuser4@example.com",
                Password="password123",
                LegalName="Test User Four",
                ProfilePhotoNO=1,
                Is_Admin=0
            )
            db.session.add(user1)
            db.session.commit()

            # Try inserting a user with the same email (should raise an IntegrityError)
            user2 = User(
                UserName="test_user5",
                Email="testuser4@example.com",  # Duplicate email
                Password="password456",
                LegalName="Test User Five",
                ProfilePhotoNO=2,
                Is_Admin=0
            )
            db.session.add(user2)
            try:
                db.session.commit()
                self.fail("IntegrityError expected due to duplicate email")
            except Exception as e:
                self.assertTrue('IntegrityError' in str(e))

    def test_user_admin_status(self):
        """Test the admin status of a user."""
        with self.app.app_context():
            # Insert a new user as admin
            admin_user = User(
                UserName="admin_user",
                Email="admin@example.com",
                Password="adminpassword123",
                LegalName="Admin User",
                ProfilePhotoNO=1,
                Is_Admin=1  # Admin status set to 1
            )
            db.session.add(admin_user)
            db.session.commit()

            # Fetch the admin user
            fetched_user = db.session.query(User).filter_by(Email="admin@example.com").first()

            # Assertions to verify the admin status
            self.assertIsNotNone(fetched_user)
            self.assertEqual(fetched_user.Is_Admin, 1)


if __name__ == '__main__':
    unittest.main()
