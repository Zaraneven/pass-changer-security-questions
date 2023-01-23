import dotenv from 'dotenv';
dotenv.config();
const config = {
  port: process.env.PORT,
  secret: process.env.JWT_KEY,
  mongo: 'mongodb://localhost:27017/users',
};
export default config;