import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './AdminLogin.css';
const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (username === "admin" && password === "admin123") {
      navigate("/admin-dashboard");
    } else {
      alert("Invalid username or password.");
    }
  };

  return (
    <div className="login-body-admin">
    <header>
   <nav className="logo-admin">
     <h1 className="navbar-brand" href="/">
       Seat Secure
     </h1>
   </nav>
 </header>
 <div className="container-admin">
  
 <div className="left-half-admin">
 <div className="txt-container">
   <div className="row">
     <div className="col-md-12">
       <div className="card">
         <div className="card-body">
           <h4 className="card-title">Welcome to Seat Secure</h4>
           <p className="card-text">
             Seat Secure is a web application that allows users to book seats for events.
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
    <div className='login-container-admin'style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Admin Login</h1>
      <form onSubmit={handleLogin} style={{ maxWidth: "300px" }}>
        <div  className='words'style={{ marginBottom: "25px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter admin username"
            style={{ padding: "10px 25px", width: "100%" }}
          />
        </div >
        <div className='words1' style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px", width:"100%" }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            style={{ padding: "10px 25px", width: "100%" }}
          />
        </div>
        <button className="login-button" type="submit">
          Login
        </button>
      </form>
    </div>
    </div>
  </div>
  );
};

export default AdminLogin;
