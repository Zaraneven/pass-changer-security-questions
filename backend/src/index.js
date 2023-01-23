import config from "./config/config";
import app from "./app";
import mongoose from 'mongoose';


mongoose.Promise = global.Promise;
mongoose.connect(config.mongo)
    .then(() => console.log('MongoDB connected successfully...'))
    .catch(() => console.log(`Error connecting to MongoDB ${config.mongo}!!!`))

app.listen(config.port, err => {
    if (err) return console.log(err);
    console.log(`Server started on port ${config.port}`)
});