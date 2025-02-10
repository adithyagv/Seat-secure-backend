import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });
  
      if (response.status === 200) {
        const { user, events } = response.data;
  
        
        navigate("/home", { state: { user, events } });
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert(
        error.response?.data?.message || "Invalid credentials. Please try again!"
      );
    }
  };

  const handleUserRegistration = () => {
    navigate("/register");
  };

  const handleAdminLogin = () => {
    navigate("/admin-login");
  };

  return (
    <div className="login-body">
       <header>
      <nav className="logo">
        <h1 className="navbar-brand" href="/">
          Seat Secure
        </h1>
      </nav>
    </header>
    <div className="container">
     
    <div className="left-half">
    <div className="txt-container">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Welcome to Seat Secure</h4>
              <p className="card-text">
                Searching for events? You're in the right place.
                Your gateway to unforgettable experiences.
              </p>
              <p className="card-text">
                Please login to continue.
              </p>
              
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    
      <div className="login-container">
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>User Login</h1>
              <form onSubmit={handleLogin} style={{ maxWidth: "300px", margin: "auto" }}>
                <div className="word" style={{ marginBottom: "20px" }}>
                  <label className="email" style={{ display: "block", marginBottom: "5px" }}>Email</label>
                    <input 
                       type="email"
                        value={email}
                          onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                              style={{ padding: "10px", width: "100%" }}
                                  />
                                </div>
                              <div className="word1" style={{ marginBottom: "20px",width:"300px" }}>
                                <label style={{ display: "block", marginBottom: "5px" }}>Password</label>
                                  <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    style={{ padding: "10px", width: "100%" }}
                                  />
                              </div >
                              <button type="submit" className="login-buton">
                                Login
                                </button>
                                
                </form>

     
                <div style={{ marginTop: "20px" }}>
  <p className="link-text" onClick={handleUserRegistration}>
    Not registered? Sign up here
  </p>
  <p className="link-text" id="admin" onClick={handleAdminLogin}>
    Admin Login
  </p>
</div>

    </div>
    </div>
    </div>
    </div>
    
  );
};

export default LoginPage;
