import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import './EventDetails.css';
const EventDetails = () => {
  const location = useLocation();
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user = location.state?.user;
  
  useEffect(() => {
    console.log("Fetching details for event ID:", id);
    fetchEventDetails();
  }, [id]);
  const handleEventClick = (id) => {
    navigate(`/event/${id}`);
  };
  const handleProfileClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

 

  const handleLogout = () => {
    navigate("/"); 
  };

  const fetchEventDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/event/${id}`);
      if (!response.ok) throw new Error("Failed to fetch event details");

      const data = await response.json();
      console.log("Fetched event data:", data); // Debugging Log
      setEvent(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching event details:", error);
      setError("Event not found or failed to fetch details.");
      setLoading(false);
    }
  };

  if (loading) return <p>Loading event details...</p>;
  if (error) return <p>{error}</p>;
  if (!event) return <p>Event not found.</p>;
  const imageUrl = event.image ? `http://localhost:5000/uploads/${encodeURIComponent(event.image)}` : null;

  return (
    <div className="event-details" style={{backgroundImage: `url(${event.image})`}}>
      <div className="header-det">
        <h1 onClick={() => navigate(-1)}>Seat Secure</h1>
        <div className="profile-container">
          <button onClick={handleProfileClick} className="profile-btn">My Profile</button>
          {dropdownOpen && (
            <div className="dropdown-menu">
            
              <button onClick={handleLogout} className="dropdown-item">Logout</button>
            </div>
          )}
        </div>
      </div>
      <h2 style={{color:"white"}}>{event.title}</h2>
      <div className="event-image-det">
      <img style={{ width: "20%", height: "auto",  }}
                  src={event.image} // Use the image URL directly
                  alt={event.title}
                  
                />
                </div>
      <h3 style={{color:"white"}}>Event Details</h3>
                <div className="event-cards-container-det">
  <div className="event-card-det">
    <p><strong>Date:</strong> {event.date}</p>
    <p><strong>Time:</strong> {event.time}</p>
    <p><strong>Venue:</strong> {event.venue}</p>
  </div>

  <div className="event-card-det">
    <p><strong>Description:</strong></p>
    <p>{event.description}</p>
  </div>

  <div className="event-card-det">
    <p><strong>Price:</strong> ₹{event.price} per person</p>
    <p><strong>City:</strong> {event.city}</p>
  </div>
</div>
<button className='bn'onClick={() => navigate(`/payment/${id}`)}>Book Now</button>
    </div>
  );
};

export default EventDetails;