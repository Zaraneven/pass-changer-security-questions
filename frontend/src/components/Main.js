import React from "react";
import { useNavigate } from "react-router-dom";

const Main = () => {
  const navigate = useNavigate();
  return (
    <div>
    <div style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10%",
          }}>
        <h2>Base Login App</h2>
    </div>
    <div style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "3%",
          }}>
      <button
        className="button ui primary"
        onClick={() => navigate("/register")}
      >
        Register
      </button>
      <button className="button ui primary" onClick={() => navigate("/login")}>
        Login
      </button>
    </div>
    </div>
  );
};

export default Main;
