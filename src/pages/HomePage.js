import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;
  const [events, setEvents] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      console.log("Fetching events for city:", user.city); 
      fetchEvents(user.city);
    }
  }, [user, navigate]);

  const fetchEvents = async (city) => {
    try {
      const response = await fetch(`http://localhost:5000/api/events/${city}`);
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      console.log("Fetched events:", data.events); 
      setEvents(data.events);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleEventClick = (id) => {
    navigate(`/event/${id}`);
  };

  const handleProfileClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

 

  const handleLogout = () => {
    navigate("/"); // Redirect to login page
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="homepage">
      <div className="header">
        <h1>Seat Secure</h1>
        
        <div className="profile-container">
          <button onClick={handleProfileClick} className="profile-btn">My Profile</button>
          {dropdownOpen && (
            <div className="dropdown-menu">
              
              <button onClick={handleLogout} className="dropdown-item">Logout</button>
            </div>
          )}
        </div>
      </div>
      <h1>Welcome, {user?.username}!</h1>
      <h2>Upcoming Events in {user?.city}</h2>
      <div className="search-bar">
      <input
        type="text"
        placeholder="Search events..."
        
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      </div>
      <div className="event-cards">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div key={event._id} className="event-card" onClick={() => handleEventClick(event._id)}>
              {event.image && (
                <img
                  src={event.image}
                  alt={event.title}
                  className="event-image"
                />
              )}
              <h3>{event.title}</h3>
              <p><strong>Type:</strong> {event.type}</p>
              <p><strong>Date:</strong> {event.date}</p>
              <button className="book-ticket-btn">Book Ticket</button>
            </div>
          ))
        ) : (
          <p>No events found for {user?.city}.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
