import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const [securityQuestions, setSecurityQuestions] = useState([]);
  const [email, setEmail] = useState("");
  const [answers, setAnswers] = useState([]);
  const [newPassword, setNewPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchSecurityQuestions();
  }, []);

  const fetchSecurityQuestions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/security");
      const allQuestions = res.data.questions;
      const randomQuestions = allQuestions
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);
      setSecurityQuestions(randomQuestions);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnswerChange = (e, id) => {
    setAnswers({ ...answers, [id]: e.target.value });
  };

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
    if (newPassword !== repeatedPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const securityQuestionsAnswers = securityQuestions.map(
        (question, index) => ({
          questionId: question._id,
          question: question.question,
          answer: answers[index],
        })
      );
      const response = await axios.put(
        `http://localhost:5000/api/users/forget-password`,
        { email, securityQuestions: securityQuestionsAnswers, newPassword }
      );
      if (response.status === 200) {
        setEmail("");
        setAnswers({});
        setNewPassword("");
        navigate("/login");
        alert("Password reset successfully");
      } else {
        alert(response.data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="reg">
      <form className="ui form" onSubmit={handleSubmit}>
        <h3 style={{ fontWeight: "bold" }}>Please enter your email !</h3>
        <label>
          Email
          <div className="field">
            <div className="ui input">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
        </label>
        <h3 style={{ fontWeight: "bold" }}>
          Please answer security questions !
        </h3>

        {securityQuestions.map((question, index) => (
          <div key={index}>
            <label>
              {question.question}
              <div className="field">
                <div className="ui input">
                  <input
                    type="text"
                    onChange={(e) => handleAnswerChange(e, index)}
                  />
                </div>
              </div>
            </label>
          </div>
        ))}
        <h3 style={{ fontWeight: "bold" }}>Please enter your new password !</h3>
        <label>
          New Password
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
        <label>
          Repeate Password
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
        {error && <p>{error}</p>}
        <div className="btn">
          <button className="ui button primary" type="submit">
            Reset Password
          </button>
        </div>
      </form>
    </div>
  );
};
export default ForgetPassword;
