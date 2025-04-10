from flask import request
from datetime import datetime
from .model import Event
from . import app, db


# create an event
@app.route("/events", methods=['POST'])
def create_event():
    data = request.json
    description = data.get("description")
    if description:
        event = Event(
            description = description
        )
        db.session.add(event)
        db.session.commit()
    return event.format_event()

# get all events
@app.route("/events", methods=['GET'])
def get_events():
    events = Event.query.order_by(Event.created_at.asc()).all()
    event_list = []
    for event in events:
        event_list.append(event.format_event())
    return {"events": event_list}
    # return make_response({"events":[event.format_event() for event in events]})

# get a single event
@app.route("/events/<id>", methods=['GET'])
def get_event(id):
    event = Event.query.filter_by(id=id).first()
    return {"event": event.format_event()}

# update an event
@app.route("/events/<id>", methods=['PUT'])
def update_event(id):
    event = Event.query.filter_by(id=id).first()
    data = request.json
    description = data.get("description")
    if description:
        event.description = description
        event.created_at = datetime.utcnow()
        db.session.commit()
    return {"event": event.format_event()}

# delete an event
@app.route("/events/<id>", methods=['DELETE'])
def delete_event(id):
    event = Event.query.filter_by(id=id).first()
    if not event:
        return {"error": "Event not found"}
    db.session.delete(event)
    db.session.commit()
    return {"message": "Event deleted successfully"}


if __name__ == "__main__":
    app.run()
