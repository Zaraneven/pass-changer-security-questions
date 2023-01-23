import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [lock, setLock] = useState(false)
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    
      if (
        error ===
        "Too many login attempts. Account locked. Please reset your password."
      ) {
        setLock(true)
      }
    
    
  }, [error]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = { email, password };
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        body,
        config
      );
      if (
        res.data.error ===
        "Too many login attempts. Account locked. Please reset your password."
      ) {
        setError(res.data.error);
      }
      //localStorage.setItem("token", res.data.token);
      localStorage.setItem("id", res.data.id);

      navigate("/welcome");
    } catch (err) {
      setError(err.response.data.error);
    }
  };

  return (
    <div className="reg">
      <form className="ui form login" onSubmit={(e) => onSubmit(e)}>
        <div className="field">
          <div className="ui input">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="field">
          <div className="ui input">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <button className="ui primary button" type="submit">
          Login
        </button>
        {!lock ? (
        <button
          className="ui primary button"
          onClick={() => navigate("/forget-password")}
        >
          Forget Password
        </button>
        ) : (
          <button
          className="ui primary button"
          onClick={() => navigate("/reset-password")}
        >
          Reset Password
        </button>
        )}
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default Login;
