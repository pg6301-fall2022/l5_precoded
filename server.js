import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

const users = [
    {
        username: "administrator", password: "mostly secret", fullName: "Testsson"
    },
    {
        username: "dummyuser", password: "dummy", fullName: "Randy the Random"
    }
]



app.get("/login", (req, res) => {
    // GET returns some data ( server -> client)
    const cookieUsername = req.signedCookies.username;

    if(!cookieUsername) {
        return res.sendStatus(401);
    }

    const user = users.find(u => u.username === cookieUsername);
    const { fullName, username } = user;
    res.json({ username, fullName });
});

app.post("/login", (req, res) => {
    // POST sends data (client -> server)
    // Since POST sends data from client, we can use it to check that password is correct

    const { password, username } = req.body;

    const user = users.find(u => u.username === username);

    if(user && user.password === password) {
        res.cookie("username", username, {signed: true});
        res.sendStatus(200);
    }
    else {
        res.sendStatus(401);
    }

});

app.use(express.static("public"));

const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`server started at http://localhost:${server.address().port}`);
});
