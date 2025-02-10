import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./Payment.css";
const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentDetails, setPaymentDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation(); // Correct way to get location
  const user = location.state?.user;
  

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/event/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch event details");
        }
        const data = await response.json();
        setEvent(data);
        setTotalPrice(parseFloat(data.price.replace("$", "")) * 1); // Convert price to number
        setLoading(false);
      } catch (error) {
        console.error("Error fetching event details:", error);
        setError("Event not found or failed to fetch details.");
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleTicketChange = (e) => {
    const count = parseInt(e.target.value) || 1;
    setTicketCount(count);
    if (event) {
      setTotalPrice(count * parseFloat(event.price.replace("$", ""))); // Convert price to number
    }
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
    setPaymentDetails({});
  };

  const handleInputChange = (e) => {
    setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    navigate(`/feedback/${id}`);
  };

  if (loading) {
    return <p>Loading event details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!event) {
    return <p>Event not found!</p>;
  }
  
  const handleProfileClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

 

  const handleLogout = () => {
    navigate("/"); 
  };


  return (
    <div className="payment-body">
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
      <h2>Payment for {event.title}</h2>
      <div className="bill-container">
        <div className="bill">
          <div className="e1">
        <h3>Event Summary:</h3>
        <hr />
      <p><strong>Date:</strong> {event.date}</p>
      <p><strong>Venue:</strong> {event.venue}</p>
      <p><strong>Price per Ticket:</strong> ₹{event.price}</p>
      </div>
      <div className="e2">
      <div style={{ margin: "20px 0" }}>
        <label htmlFor="ticketCount"><strong>Number of Tickets:</strong></label>
        <hr />
        <input
          type="number"
          id="ticketCount"
          min="1"
          value={ticketCount}
          onChange={handleTicketChange}
          style={{ marginLeft: "10px", padding: "5px", width: "60px" }}
        />
        </div>
        </div>
        
        </div>
        <hr className="line" />
        <div className="e3">
  <h3 style={{    alignItems: "flex-start",textAlign: "left",justifyContent: "left"}}>Billing Summary</h3>
  <hr />
  <p><strong>Tickets ({ticketCount} x {event.price})</strong>: ₹{totalPrice.toFixed(2)}</p>
  <p><strong>Internet Handling Fee</strong>: ₹70.00</p>
  <p><strong>GST (18%)</strong>: ₹{(event.price * 0.18).toFixed(2)}</p>
  <hr />
  <p style={{ fontSize: "20px", fontWeight: "bold", marginTop: "10px" }}>
    <strong>Grand Total</strong>: ₹{(totalPrice + event.price * 0.18 + 70).toFixed(2)}
  </p>
  </div>
</div>
<h2 style={{marginTop:"35px"}}>Payment Methods</h2>
      <div className="payment-container">
        <div className="payment-method">
        <form onSubmit={handleFormSubmit}>
          <div className="p1"> 
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="creditCard"
                onChange={handlePaymentMethodChange}
              />
              Credit Card
            </label>
              {paymentMethod === "creditCard" && (
            <div className="pp1" style={{ marginTop: "20px" }}>
              <h4>Credit Card Details</h4>
              <label>Card Number: </label>
              <input
                type="text"
                name="cardNumber"
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
              />
              <br />
              <label>Expiry Date: </label>
              <input
                type="text"
                name="expiryDate"
                onChange={handleInputChange}
                placeholder="MM/YY"
              />
              <br />
              <label>CVV: </label>
              <input
                type="password"
                name="cvv"
                onChange={handleInputChange}
                placeholder="***"
              />
            </div>
          )}
           
          </div>
          <div className="p2">
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="debitCard"
                onChange={handlePaymentMethodChange}
              />
              Debit Card
            </label>
            {paymentMethod === "debitCard" && (
            <div className="pp2"style={{ marginTop: "20px" }}>
              <h4>Debit Card Details</h4>
              <label>Card Number: </label>
              <input
                type="text"
                name="cardNumber"
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
              />
              <br />
              <label>Expiry Date: </label>
              <input
                type="text"
                name="expiryDate"
                onChange={handleInputChange}
                placeholder="MM/YY"
              />
              <br />
              <label>CVV: </label>
              <input
                type="password"
                name="cvv"
                onChange={handleInputChange}
                placeholder="***"
              />
            </div>
          )}
          </div>
          <div className="p3">
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="upi"
                onChange={handlePaymentMethodChange}
              />
              UPI
            </label>
            {paymentMethod === "upi" && (
            <div  className='pp3'style={{ marginTop: "20px" }}>
              <h4>UPI Details</h4>
              <label>UPI ID: </label>
              <input
                type="text"
                name="upiId"
                onChange={handleInputChange}
                placeholder="example@upi"
              />
            </div>
          )}

          </div>
        
        <button className="bn-pay"
            type="submit"
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              fontSize: "16px",
            }}
          >
            Confirm Payment
          </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;