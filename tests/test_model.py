import sys
import os
from flask import Flask
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from database import db, create_database, User, Image, Feedback, Favorites\

## this model is used to create a new app instance for each test with in-memory DB
## it not used directly in this file but it is used in other test files.

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
