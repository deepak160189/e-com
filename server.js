import express from "express";
import { APP_PORT, DB_URL } from "./config";
import routes from './routes';
import mongoose from "mongoose";
import errorHandler from "./middlewares/errorHandler";

// Database connection
mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB");
});

const app = express();
app.use(express.json());
app.use("/api", routes);


app.use(errorHandler);
app.listen(APP_PORT, () => console.log(`Listening PORT ${APP_PORT}.`));
