import {useEffect, useState} from 'react';
import axios from "axios";
import {format} from "date-fns";
import './App.css';


const baseUrl = "http://localhost:5000"

function App() {
  const [description, setDescription] = useState("");
  const [eventsList, setEventsList] = useState([]);
  const [eventId, setEventId] = useState(null);
  const [editDescription, setEditDescription] = useState("");

  const fetchEvents = async () => {
    const data = await axios.get(`${baseUrl}/events`)
    const { events } = data.data
    setEventsList(events);
    console.log(events);
  }

  const handleChange = (e, field) => {
    if (field === 'edit') {
      setEditDescription(e.target.value);
    } else {
      setDescription(e.target.value);
    }
  }

  const handleDelete = async (id) => {
    try {
      axios.delete(`${baseUrl}/events/${id}`);
      const updatedList = eventsList.filter(event => event.id !== id);
      setEventsList(updatedList);
    } catch(err) {
      console.error(err.message)
    }
  }

  const handleEditClick = (event) => {
    setEventId(event.id);
    setEditDescription(event.description);
  }

  const handleCancelClick = () => {
    setEventId(null);
    setEditDescription('');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editDescription) {
        const data = await axios.put(`${baseUrl}/events/${eventId}`, {description: editDescription});
        const updatedEvent = data.data.event;
        const updatedList = eventsList.map(event => {
          if (event.id === eventId) {
            return event = updatedEvent
          } else {
            return event
          }
        })
        setEventsList(updatedList);
      } else {
        const data = await axios.post(`${baseUrl}/events`, {description})
        setEventsList([...eventsList, data.data]);
      }
      setDescription('');
      setEditDescription('');
      setEventId(null);
    } catch(err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, [])

  return (
    <div className="App">
        <section className="App-header">
          <form onSubmit={handleSubmit}>
            <label htmlFor="description">Description</label>
            <input
              onChange={(e) => handleChange(e, 'description')}
              type="text"
              name="description"
              id="description"
              placeholder="Describe the event"
              value={description}
            />
            <button type="submit">Submit</button>
          </form>
        </section>
        <section className="App-header">
          <ul>
            {eventsList.map(event => {
              <li style={{display: "flex", gap: "20px"}} key={event.id}></li>
              if (eventId === event.id) {
                return (
                  <li style={{display: "flex", gap: "20px"}} key={event.id}>
                    <form onSubmit={handleSubmit} key={event.id}>
                      <input
                        onChange={(e) => handleChange(e, 'edit')}
                        type="text"
                        name="editDescription"
                        id="editDescription"
                        value={editDescription}
                      />
                      <button type="submit">Save</button>
                      <button type="button" onClick={handleCancelClick}>Cancel</button>
                    </form>
                  </li>
                )
              } else {
                return (
                  <li style={{display: "flex", gap: "20px"}} key={event.id}>
                    {format(new Date(event.created_at), "MM/dd, p")}:
                    {event.description}
                    <button onClick={() => handleEditClick(event)}>Edit</button>
                    <button onClick={() => handleDelete(event.id)}>Delete</button>
                  </li>
                )
              }
            })}
          </ul>
        </section>
    </div>
  );
}

export default App;
