import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import UserRegistration from "./pages/UserRegistration";
import HomePage from "./pages/HomePage";
import EventDetails from "./pages/EventDetails";
import Payment from "./pages/Payment";
import Feedback from "./pages/Feedback";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";


function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<UserRegistration />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/event/:id" element={<EventDetails />} />
      <Route path="/payment/:id" element={<Payment />} />
      <Route path="/feedback/:id" element={<Feedback />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
