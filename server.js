import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import e from "express";
dotenv.config();

const app = express();
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use((req, res, next) => {
    const { username } = req.signedCookies;
    req.user = users.find(u => u.username === username);
    console.log("before request");
    next();
    console.log("after request");
});

const loginPath = new express.Router();
const userPath = new express.Router();



const users = [
    {
        username: "administrator", password: "mostly secret", fullName: "Testsson"
    },
    {
        username: "dummyuser", password: "dummy", fullName: "Randy the Random"
    }
]

loginPath.get("/", (req, res) => {
    const { username } = req.signedCookies;
    const user = users.find(u => u.username === username);
    res.json(user);
});

loginPath.post("/", (req, res) => {
    const { password, username } = req.body;
    const user = users.find(u => u.username === username);
    if(!user || user.password !== password){
        return res.sendStatus(401);
    } else {
        res
            .cookie("username", user.username, {signed: true})
            .redirect("/");
    }
});

userPath.get("/", (req, res) => {
    if(!req.user){
        return res.sendStatus(401);
    }
    res.json(users);
});

userPath.post("/", (req, res) => {
    const { username, fullName, password } = req.body;
    if(!username || !fullName || !password){
        return res.sendStatus(400);
    }
    users.push({username, fullName, password});
    res.redirect("/");
});



app.use("/login", loginPath);
app.use("/users", userPath);

app.use(express.static("public"));

const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`server started at http://localhost:${server.address().port}`);
});
