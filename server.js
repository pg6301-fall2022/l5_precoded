import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import {userPath, loginPath, userMiddleware} from "./userRouter.js";

dotenv.config();

const app = express();
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(userMiddleware);
app.use("/login", loginPath);
app.use("/users", userPath);

app.use(express.static("public/"));

const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`server started at http://localhost:${server.address().port}`);
});
