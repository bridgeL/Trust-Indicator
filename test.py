from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
db = SQLAlchemy(app)

class Person(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        new_person = Person(name="Alice")
        db.session.add(new_person)
        db.session.commit()
        print("Database and table created, sample record inserted.")