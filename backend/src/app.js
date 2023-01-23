import express from "express";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";
import userRoutes from "./routes/user.routes.js";
import changeRoutes from "./routes/changePass.routes.js";
import securQuRoutes from "./routes/securQuest.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compress());
app.use(helmet());
app.use(cors());

app.use("/", userRoutes);
app.use("/", changeRoutes);
app.use("/", securQuRoutes);

export default app;
