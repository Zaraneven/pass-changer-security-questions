import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChangePassword from "./components/ChangePassword";
import ForgetPassword from "./components/ForgetPassword";
import Login from "./components/Login";
import Main from "./components/Main";
import Register from "./components/Register";
import ResetPassword from "./components/ResetPassword";
import SecurityQuestions from "./components/SecurityQuestions";
import Welcome from "./components/Welcome";

const App = () => {
  window.addEventListener("unload", (event) => {
    localStorage.clear();
}); 
  return (
    <Router>
      <div className="container">
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/security" element={<SecurityQuestions />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
      </Routes>
      </div>
    </Router>
  );
};

export default App;
