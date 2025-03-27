# import sys
# import os
# from flask import Flask
# import unittest
# from test_driver import DatabaseTest  # Import the common test class

# sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
# from database import db, create_database, User, Image, Feedback, Favorites

# class UserTest(DatabaseTest):
#     def test_user_insertion(self):
#         with self.app.app_context():
#             # Insert a new user
#             user = User(
#                 email="test@example.com",
#                 password="password123"
#             )
#             db.session.add(user)
#             db.session.commit()

#             # Fetch the user from the database
#             fetched_user = db.session.query(User).filter_by(email="test@example.com").first()
#             self.assertIsNotNone(fetched_user)
#             self.assertEqual(fetched_user.email, "test@example.com")
#             self.assertEqual(fetched_user.password, "password123")

#     def test_user_update(self):
#         with self.app.app_context():
#             user = User(
#                 email="old_email@example.com",
#                 password="password123"
#             )
#             db.session.add(user)
#             db.session.commit()

#             user.email = "new_email@example.com"
#             db.session.commit()

#             updated_user = db.session.query(User).filter_by(id=user.id).first()
#             self.assertEqual(updated_user.email, "new_email@example.com")

# if __name__ == '__main__':
#     unittest.main()
