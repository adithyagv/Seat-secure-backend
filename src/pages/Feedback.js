import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom"; // Add useLocation here
import axios from "axios";
import "./Feedback.css";

const Feedback = () => {
  const { id } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackList, setFeedbackList] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;
  

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/feedback/${id}`);
      setFeedbackList(response.data.feedbacks);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/feedback", {
        eventId: id,
        rating,
        comment,
      });

      console.log("Feedback Submitted:", response.data);
      setFeedbackSubmitted(true);

      // Refresh feedback list
      fetchFeedbacks();
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };
  const handleProfileClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const home = () => {
    navigate("/home", { state: { user } });
  }

 

  const handleLogout = () => {
    navigate("/"); 
  };


  return (
    <div className="feedback">
       <div className="header-det">
        <h1 onClick={() => home()}>Seat Secure</h1>
        <div className="profile-container">
          <button onClick={handleProfileClick} className="profile-btn">My Profile</button>
          {dropdownOpen && (
            <div className="dropdown-menu">
            <button onClick={handleLogout} className="dropdown-item">Logout</button>
            </div>
          )}
        </div>
      </div>
      <div className="feedback-container">
      <div className="feedback-form">
        <h2 className="fb">Leave Feedback for the event</h2>
        {!feedbackSubmitted ? (
          <form onSubmit={handleSubmit}>
            <div>
              <label>Rating:</label>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  style={{
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    color: rating >= star ? "gold" : "gray",
                  }}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
            <div className="comment">
              <label>Comment:</label>
              <textarea className="comment-box"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="4"
                cols="50"
                placeholder="Write your feedback..."
              />
            </div>
            <button className="bn-fb" type="submit" >Submit Feedback</button>
          </form>
        ) : (
          <div>
            <h3>Thank you for your feedback!</h3>
            <p>Your feedback has been submitted successfully.</p>
          </div>
        )}
      </div>
        <hr />
      
      <div className="feedback-list">
        <h3>Recent Feedback</h3>
        {feedbackList.length > 0 ? (
          feedbackList.map((feedback, index) => (
            <div key={index} className="feedback-item">
              <p><strong>Rating:</strong> {feedback.rating} ★</p>
              <p><strong>Comment:</strong> {feedback.comment}</p>
              <p className="timestamp">Posted on: {new Date(feedback.createdAt).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p>No feedback yet for this event.</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default Feedback;
