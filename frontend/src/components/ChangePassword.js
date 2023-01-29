import React, { useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  
  const [error, setError] = useState("");
  
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("")
  const [repeatedPassword, setRepeatedPassword] = useState('');
  const navigate = useNavigate();

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setError(
        "Password must contain at least 8 characters, one capital letter and one special character"
      );
      return;
    }
    try {
      const userId = localStorage.getItem("id");

      const response = await axios.put(
        `http://localhost:5000/api/users/change-password/${userId}`,
        {oldPassword, newPassword }
      );
      if (response.status === 200) {
        
        setNewPassword("");
        setOldPassword("")
        alert("Password changed successfully");
        localStorage.clear();
        navigate("/login");
      } else {
        alert(response.data.error);
      }
    } catch (err) {
      console.error(err);
      setError(err.response.data.error)
    }
  };

  return (
    <div className="reg">
      <form className="ui form login" onSubmit={handleSubmit}>
      
        <h3 style={{fontWeight: 'bold'}}>Please enter your old and new password !</h3>
         <label>Old Password
        <div className="field">
          <div className="ui input">
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
        </div>
      </label>
        <label>
          New Password
          <div className="field">
            <div className="ui input">
              <input
                type="password"
                value={repeatedPassword}
                onChange={(e) => setRepeatedPassword(e.target.value)}
              />
            </div>
          </div>
        </label>
        <label>
          Repeated Password
          <div className="field">
            <div className="ui input">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>
        </label>
        <div className="btn">
          <button className="ui button primary" type="submit">
            Change Password
          </button>
        </div>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default ChangePassword;
