import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const [user, setUser] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("id");
        const response = await axios.get(
          `http://localhost:5000/api/users/welcome/${userId}`
        );
        setUser(response.data.user);
        if (!response.data.user.securityQuestionsAnswered) {
          navigate("/security");
        }
      } catch (err) {
        setError(err.response.data);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  function logO() {
    localStorage.clear();
    navigate("/");
  }

  if (error) return;
  if (!user) return;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "10%",
        }}
      >
        {!user && <p>Loading...</p>}

        <h2>Welcome, {user.name}!</h2>
        {error && <p>{error}</p>}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "10%",
        }}
      >
        <button
          className="ui button primary"
          onClick={() => navigate("/change-password")}
        >
          Change Password
        </button>
        <button className="ui button primary" onClick={logO}>
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Welcome;
