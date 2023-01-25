import SecurityQuestion from '../models/securQuest.model.js';
import mongoose from 'mongoose'

 require("@babel/register")({
    presets: ["@babel/preset-env"]
  }); 
mongoose.connect('mongodb://localhost:27017/users', {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log('MONGO CONNECTION OPEN')
  })
  .catch((err) => {
    console.log(err)
  });
const seedQuestions = [
    { question: "What is the name of your favorite childhood friend?" },
      { question: "What time of the day were you born?" },
      { question: "What was your dream job as a child?" },
      { question: "What is the street number of the house you grew up in?" },
      { question: "Who was your childhood hero?" },
];



const seedDB = async () => {
    await SecurityQuestion.deleteMany({})
    await SecurityQuestion.insertMany(seedQuestions);
};

seedDB().then(() => {
    mongoose.connection.close()
    console.log('closed')
})