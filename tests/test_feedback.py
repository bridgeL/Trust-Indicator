import sys
import os
from flask import Flask
import unittest
from test_model import DatabaseTest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from database import db, create_database, User, Image, Feedback, Favorites

class FeedbackTest(DatabaseTest):

    def test_feedback_insertion(self):
        """Test inserting a feedback record."""
        with self.app.app_context():
            feedback = Feedback(
                name="John Doe",
                email="johndoe@example.com",
                date="2025-03-28",
                feedback_type="Suggestion",
                content="I really like this feature, but it can be improved!"
            )
            db.session.add(feedback)
            db.session.commit()

            fetched_feedback = db.session.query(Feedback).filter_by(email="johndoe@example.com").first()
            self.assertIsNotNone(fetched_feedback)
            self.assertEqual(fetched_feedback.name, "John Doe")
            self.assertEqual(fetched_feedback.feedback_type, "Suggestion")

    def test_feedback_update(self):
        """Test updating a feedback record's type."""
        with self.app.app_context():
            feedback = Feedback(
                name="Alice Smith",
                email="alice@example.com",
                date="2025-03-28",
                feedback_type="Bug Report",
                content="There is a minor UI bug on the main page."
            )
            db.session.add(feedback)
            db.session.commit()

            feedback.feedback_type = "Feature Request"
            db.session.commit()

            updated_feedback = db.session.query(Feedback).filter_by(email="alice@example.com").first()
            self.assertEqual(updated_feedback.feedback_type, "Feature Request")

    def test_feedback_deletion(self):
        """Test deleting a feedback record."""
        with self.app.app_context():
            feedback = Feedback(
                name="Bob Johnson",
                email="bob@example.com",
                date="2025-03-28",
                feedback_type="General Inquiry",
                content="I have a question about your service."
            )
            db.session.add(feedback)
            db.session.commit()

            db.session.delete(feedback)
            db.session.commit()

            deleted_feedback = db.session.query(Feedback).filter_by(email="bob@example.com").first()
            self.assertIsNone(deleted_feedback)

if __name__ == '__main__':
    unittest.main()