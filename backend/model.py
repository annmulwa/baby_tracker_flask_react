from datetime import datetime
from . import db


class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f"Event: {self.description}"

    def __init__(self, description):
        self.description = description

    def format_event(self):
        return {
            "id": self.id,
            "description": self.description,
            "created_at": self.created_at
        }