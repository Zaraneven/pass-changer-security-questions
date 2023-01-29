import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SecurityQuestionsForm = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchSecurityQuestions = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/security");
        setQuestions(res.data.questions);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSecurityQuestions();
  }, []);

  const handleAnswerChange = (e, index) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = {
      questionId: questions._id,
      answer: e.target.value,
    };
    setAnswers(updatedAnswers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let userId = localStorage.getItem("id");
      const securityQuestions = questions.map((question, index) => ({
        questionId: question._id,
        answer: answers[index].answer,
      }));
      await axios.put(`http://localhost:5000/api/users/security/${userId}`, {
        securityQuestions,
      });
      navigate("/welcome");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="reg">
      <form className="ui form login" onSubmit={handleSubmit}>
      <h3 style={{fontWeight: 'bold'}}>Please answer security questions !</h3>
        {questions.map((question, index) => (
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
        <div className="btn">
          <button className="ui button primary" type="submit">
            Save Answers
          </button>
        </div>
      </form>
    </div>
  );
};

export default SecurityQuestionsForm;