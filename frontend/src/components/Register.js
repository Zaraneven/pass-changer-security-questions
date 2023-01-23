import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [repeatedPassword, setRepeatedPassword] = useState('');
  const [error, setError] = useState('');

  const { name, email, password } = formData;
  const navigate = useNavigate()
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
        setError('Password must contain at least 8 characters, one capital letter and one special character')
        return;
    }
    if (password !== repeatedPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const newUser = { name, email, password };
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const body = JSON.stringify(newUser);
      const res = await axios.post(
        "http://localhost:5000/api/users/register",
        body,
        config
      );
      localStorage.setItem('id', res.data.id)
      navigate('/security')
    } catch (err) {
      console.error(err.response.data);
      setError(err.response.data.message)
    }
  };

  return (
    <div className="reg">
      <form className="ui form login" onSubmit={(e) => onSubmit(e)}>
        <div className="field">
            <div className="ui input">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={(e) => onChange(e)}
            required
          />
          </div>
        </div>
        <div className="field">
            <div className="ui input">
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={(e) => onChange(e)}
            required
          />
          </div>
        </div>
        <div className="field">
            <div className="ui input">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => onChange(e)}
            required
          />
          </div>
        </div>
        <div className="field">
            <div className="ui input">
          <input
            type="password"
            placeholder="Repeate Password"
            
            value={repeatedPassword}
            onChange={(e) => setRepeatedPassword(e.target.value)}
            required
          />
          </div>
        </div>
        <div className="btn">
        <button  className="ui button primary" type="submit">Register</button>
        </div>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default Register;
