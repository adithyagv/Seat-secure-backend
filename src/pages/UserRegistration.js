import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserRegistration.css"; // Ensure you have this CSS file
import axios from "axios";

const UserRegistration = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    city: "",
    interests: [],
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const cityOptions = ["Chennai", "Delhi", "Mumbai", "Kolkata", "Bangalore"];
  const interestsOptions = ["Workshops", "Sports Events", "Cultural Events"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleInterestChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      interests: checked
        ? [...prev.interests, value]
        : prev.interests.filter((interest) => interest !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/register", formData);

      if (response.status === 201) {
        setMessage("Registration successful!");
        // Pass city and interests to HomePage
        navigate("/home", {
          state: {
            selectedCity: formData.city,
            selectedInterests: formData.interests,
          },
        });
      } else {
        setMessage("Something went wrong. Please try again.");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "An unexpected error occurred. Please try again."
      );
    }
  };

  return (
    <div className="reg-container">
      <div className="left-half-reg">
        <h1>Seat Secure</h1>
      </div>
<div className="right-half-reg">
        <div className="form-container">
          <h2>User Registration</h2>
          {message && <p className="message">{message}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email ID:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Area of Location:</label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              >
                <option value="">Select your location</option>
                {cityOptions.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Area of Interest:</label>
              {interestsOptions.map((interest, index) => (
                <div key={index}>
                  <input
                    type="checkbox"
                    value={interest}
                    onChange={handleInterestChange}
                  />
                  <label>{interest}</label>
                </div>
              ))}
            </div>
            <button className='button-reg'type="submit">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;